import React from "react";
import M from "materialize-css";
import { ICategory } from "./Room";
import { VotingCards } from "./VotingCards";
import "./Categories.css";

interface Props {
  categories: ICategory[];
  handleNewCard: (id: string, u: number) => void;
}

export const Categories = ({ categories, handleNewCard }: Props) => {
  let _categoriesSelectRef;
  const [currentCategoryId, set__currentCategoryId] = React.useState("");
  const [currentCategoryName, set__currentCategoryName] = React.useState("");

  React.useEffect(() => {
    M.FormSelect.init(_categoriesSelectRef);
    if (categories && categories.length) {
      set__currentCategoryId(categories[0].id);
      set__currentCategoryName(categories[0].name);
    }
  }, [categories]);

  console.log("categories = ", categories);

  const getCurrentCategory = () =>
    categories.find((c) => c.id === currentCategoryId);

  return (
    <div className="Categories">
      <div className="input-field col s6">
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

      {categories && categories.length ? (
        <VotingCards
          category={getCurrentCategory()}
          handleNewCard={handleNewCard}
        />
      ) : null}
    </div>
  );
};
