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
import { allCatChangesSaved } from "../common/categoriesHelpers";

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
  const [currentCategoryName, set__currentCategoryName] = React.useState("");

  React.useEffect(() => {
    M.FormSelect.init(_categoriesSelectRef);
    if (categories && categories.length) {
      let newCatId = categories[0].id;
      let newCatname = categories[0].name;
      if (currentCategoryId) {
        const foundCat = categories.find((c) => c.id === currentCategoryId);
        if (foundCat) {
          newCatId = foundCat.id;
          newCatname = foundCat.name;
        }
      }

      set__currentCategoryId(newCatId);
      set__currentCategoryName(newCatname);

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

  const getCurrentCategory = () =>
    categories.find((c) => c.id === currentCategoryId);

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
          <form
            className="flex-centered cat-inputs-form"
            onSubmit={(e) => {
              e.preventDefault();
              updateCategories(EAction.update, id, {
                name: category.name,
                singular: category.singular,
              });
            }}
          >
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
              type="submit"
              disabled={allCatChangesSaved(
                id,
                categories,
                editCategoriesValues
              )}
              title="Save card"
              className="btn-floating btn-small waves-effect waves-light blue darken-4 save-category-btn"
            >
              <i className="material-icons">save</i>
            </button>

            <button
              type="button"
              title="Delete card"
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
          </form>
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
        <div className="col s12">
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
        </div>
      </div>
    );
  };

  return (
    <div className="Categories">
      {chooseCurrentCategorySection()}

      {editCategoriesSection()}

      {categories && categories.length ? (
        <VotingCards
          category={getCurrentCategory()}
          updateCategoryCards={updateCategoryCards}
        />
      ) : null}
    </div>
  );
};
