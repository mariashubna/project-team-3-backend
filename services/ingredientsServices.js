import Ingredient from "../db/models/Ingredient.js";
import HttpError from "../helpers/HttpError.js";
import sequelize from "../db/Sequelize.js";

const mainQuery = (whereCase) =>
  `
SELECT DISTINCT I.*
FROM INGREDIENTS AS I
         INNER JOIN PUBLIC.RECIPE_INGREDIENTS RI ON I.ID = RI."ingredientId"
         INNER JOIN PUBLIC.RECIPES R ON R.ID = RI."recipeId"
         INNER JOIN PUBLIC.AREAS A ON A.ID = R."areaId"
         INNER JOIN PUBLIC.CATEGORIES C ON C.ID = R."categoryId"
WHERE 1 = 1
${whereCase}
ORDER BY I.ID;
`;

export const getAllIngredients = async ({ filter }) => {
  const { category, area, assignedToRecipes } = filter;

  if (category || area || (assignedToRecipes?.toLowerCase() === "true")) {
    var where = category ? `\n AND LOWER(C.NAME)=LOWER('${category}') \n` : "";
    where = area ? where + `\n AND LOWER(A.NAME)=LOWER('${area}') \n` : where;

    return await sequelize.query(mainQuery(where), {
      model: Ingredient,
      mapToModel: true,
    });
  }

  try {
    return await Ingredient.findAll();
  } catch (err) {
    throw HttpError(500, "Failed to load ingredients");
  }
};
