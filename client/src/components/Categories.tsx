import React from "react";
import uniqid from "uniqid";
import M from "materialize-css";
import { ICategory, EAction } from "./Room";
import { VotingCards } from "./VotingCards";
import "./Categories.css";
import { Context, ERoomStatus } from "../global/Context";

interface Props {
  categories: ICategory[];
  updateCategoryCards: (id: string, u: number, a: EAction) => void;
}

export const Categories = ({ categories, updateCategoryCards }: Props) => {
  let _categoriesSelectRef;
  const {
    roomStatus,
    set__roomStatus,
    editCategoriesValues,
    set__editCategoriesValues,
  } = React.useContext(Context);
  const [currentCategoryId, set__currentCategoryId] = React.useState("");
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

  // console.log("categories = ", categories);

  const getCurrentCategory = () =>
    categories.find((c) => c.id === currentCategoryId);

  const handleChange = (id, type, val) => {
    const newEditCategoriesValues = { ...editCategoriesValues };
    newEditCategoriesValues[id][type] = val;
    set__editCategoriesValues(newEditCategoriesValues);
  };

  const handleAddCategory = () => {
    const newEditCategoriesValues = { ...editCategoriesValues };
    const newCategoryId = uniqid();
    newEditCategoriesValues[newCategoryId] = {};
    newEditCategoriesValues[newCategoryId].name = "";
    newEditCategoriesValues[newCategoryId].singular = "";
    set__editCategoriesValues(newEditCategoriesValues);
  };

  const handleDeleteCategory = (id) => {
    const newEditCategoriesValues = { ...editCategoriesValues };
    delete newEditCategoriesValues[id];
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
            title="Delete card"
            className="btn-floating btn-small waves-effect waves-light red  del-category-btn"
            onClick={() => {
              handleDeleteCategory(id);
              // updateCategoryCards(category.id, unit, EAction.delete);
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
                onClick={handleAddCategory}
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
          category={getCurrentCategory()}
          updateCategoryCards={updateCategoryCards}
        />
      ) : null}
    </div>
  );
};
