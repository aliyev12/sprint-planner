import React from "react";
import M from "materialize-css";
import {
  EAction,
  ERoomStatus,
  ICategory,
  ISession,
  ICurrentSession,
} from "../common/models";
import { Context } from "../global/Context";
import { VotingCards } from "./VotingCards";
import "./Categories.css";

interface Props {
  categories: ICategory[];
  currentSession: ICurrentSession;
  updateCategoryCards: (id: string, u: number, a: EAction) => void;
  updateCategories: (
    a: EAction,
    id?: string,
    values?: { name: string; singular: string }
  ) => void;
}

export const Categories = ({
  categories,
  currentSession,
  updateCategoryCards,
  updateCategories,
}: Props) => {
  let _categoriesSelectRef;
  const {
    roomStatus,
    set__roomStatus,
    editCategoriesValues,
    set__editCategoriesValues,
    currentCategoryId,
    set__currentCategoryId,
  } = React.useContext(Context);
  // const [currentCategoryId, set__currentCategoryId] = React.useState("");
  const [currentCategoryName, set__currentCategoryName] = React.useState("");

  React.useEffect(() => {
    M.FormSelect.init(_categoriesSelectRef);
    if (categories && categories.length) {
      set__currentCategoryId(categories[0].id);
      set__currentCategoryName(categories[0].name);

      const newEditCategoriesValues = {};

      categories.forEach((cat) => {
        newEditCategoriesValues[cat.id] = {
          name: cat.name,
          singular: cat.singular,
        };
      });

      set__editCategoriesValues(newEditCategoriesValues);
    }
  }, [categories]);

  const saveIsDisabled = (catId: string) => {
    const foundCategory = categories.find((c) => c.id === catId);
    if (!foundCategory) return false;
    const foundEditCategory = editCategoriesValues[catId];
    if (
      foundCategory.name !== foundEditCategory.name ||
      foundCategory.singular !== foundEditCategory.singular
    )
      return false;
    return true;
  };

  const getCurrentCategory = () =>
    categories.find((c) => c.id === currentCategoryId);

  // const votingCardsDisabled = () => {
  //   if (!currentSession) return true;

  //   const currCategory = getCurrentCategory();
  //   if (!currCategory || !currentSession.sessionCategories) return true;
  //   currentSession.sessionCategories
  //     .map((s) => s.categoryId)
  //     .includes(currCategory.id);
  // };

  const handleChange = (id, type, val) => {
    const newEditCategoriesValues = { ...editCategoriesValues };
    newEditCategoriesValues[id][type] = val;
    set__editCategoriesValues(newEditCategoriesValues);
  };

  const chooseCurrentCategorySection = () => {
    return (
      <div
        className="input-field col s6"
        style={{
          display: roomStatus === ERoomStatus.initial ? "block" : "none",
        }}
      >
        <select
          aria-label="Current Category"
          id="select-current-category"
          ref={(categoriesSelectRef) => {
            _categoriesSelectRef = categoriesSelectRef;
          }}
          value={currentCategoryId}
          onChange={(e) => set__currentCategoryId(e.target.value)}
        >
          {categories && categories.length
            ? categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })
            : null}
        </select>
      </div>
    );
  };

  const editCategoryListItems = () => {
    if (!editCategoriesValues || !Object.keys(editCategoriesValues).length)
      return null;

    return Object.keys(editCategoriesValues).map((id) => {
      const category = editCategoriesValues[id];
      const nameId = `cat-name-${id}`;
      const singularId = `cat-singular-${id}`;

      return (
        <li key={id} className="collection-item">
          <div className="category-actions-container">
            <div className="input-field">
              <input
                id={nameId}
                type="text"
                className="validate"
                aria-label="Category Name"
                value={category.name}
                onChange={(e) => handleChange(id, "name", e.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                id={singularId}
                type="text"
                className="validate"
                aria-label="Single Unit"
                value={category.singular}
                onChange={(e) => handleChange(id, "singular", e.target.value)}
              />
            </div>
          </div>
          <button
            disabled={saveIsDisabled(id)}
            type="button"
            title="Save card"
            className="btn-floating btn-small waves-effect waves-light blue darken-4  save-category-btn"
            onClick={() => {
              updateCategories(EAction.update, id, {
                name: category.name,
                singular: category.singular,
              });
            }}
          >
            <i className="material-icons">save</i>
          </button>

          <button
            title="Delete card"
            type="button"
            className="btn-floating btn-small waves-effect waves-light red  del-category-btn"
            onClick={() => {
              updateCategories(EAction.delete, id, {
                name: category.name,
                singular: category.singular,
              });
            }}
          >
            <i className="material-icons">delete</i>
          </button>
        </li>
      );
    });
  };

  const editCategoriesSection = () => {
    return (
      <div
        className="row"
        style={{
          display:
            roomStatus === ERoomStatus.editingCategories ? "block" : "none",
        }}
      >
        <form className="col s12">
          <ul className="collection">
            <li key={"header-row"} className="collection-item">
              <div className="category-actions-container">
                <div className="input-field">
                  <span className="input-group-header">Category Name</span>
                </div>
                <div className="input-field">
                  <span className="input-group-header">Single Unit</span>
                </div>
              </div>
              <button
                title="Add new category"
                type="button"
                className="btn-floating btn-small waves-effect waves-light green add-card-btn"
                onClick={() => {
                  updateCategories(EAction.add);
                }}
              >
                <i className="material-icons">add</i>
              </button>
            </li>
            {editCategoryListItems()}
          </ul>
        </form>
      </div>
    );
  };

  return (
    <div className="Categories">
      {chooseCurrentCategorySection()}

      {editCategoriesSection()}

      {categories && categories.length ? (
        <VotingCards
          // cardsDisabled={votingCardsDisabled()}
          category={getCurrentCategory()}
          updateCategoryCards={updateCategoryCards}
        />
      ) : null}
    </div>
  );
};
