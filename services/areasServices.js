import Area from "../db/models/Area.js";
import HttpError from "../helpers/HttpError.js";
import sequelize from "../db/Sequelize.js";

const mainQuery = (whereCase) => 
`
SELECT DISTINCT A.*
FROM AREAS AS A
         INNER JOIN PUBLIC.RECIPES R ON A.ID = R."areaId"
         INNER JOIN PUBLIC.CATEGORIES C ON C.ID = R."categoryId"
         INNER JOIN PUBLIC.RECIPE_INGREDIENTS RI ON R.ID = RI."recipeId"
         INNER JOIN PUBLIC.INGREDIENTS I ON I.ID = RI."ingredientId"
WHERE 1 = 1
${whereCase}
ORDER BY A.ID;
`

export const getAllAreas = async ({ filter }) => {
  const { category, ingridient, assignedToRecipes } = filter;

  console.log(`category ${category}, ingridient ${ingridient}, assignedToRecipe ${assignedToRecipes}`)

  if (category || ingridient || (assignedToRecipes?.toLowerCase() === "true")) {
    var where = category ? `\n AND LOWER(C.NAME)=LOWER('${category}') \n` : "";
    where = ingridient ? where + `\n AND LOWER(I.NAME)=LOWER('${ingridient}') \n` : where;

    const areas = await sequelize.query(mainQuery(where), {
      model: Area,
      mapToModel: true,
    });
    ensureNotEmpty(areas);
    return areas;
  }

  const areas = await Area.findAll({
    attributes: ["id", "name"],
    raw: true,
    order: [["id", "ASC"]],
  });

  ensureNotEmpty(areas);
  return areas;
};

function ensureNotEmpty(areas) {
  if (!areas || areas.length === 0) {
    throw HttpError(404, "No areas found");
  }
}