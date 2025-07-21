# 🍽️ Foodies Backend API

This is the backend API for the **Foodies** app – a social recipe-sharing platform.

## 🚀 Features

- JWT authentication and user profile management
- Recipes CRUD with filters (by category, area, ingredient)
- Follow/favorite users and recipes
- Upload user avatars
- Documented with Swagger (`/api-docs`)

---

## 📦 API Endpoints

### 👤 Users – Manage users

| Method | Endpoint                        | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| POST   | `/api/users/signup`             | Register a new user                 |
| POST   | `/api/users/signin`             | Login user                          |
| GET    | `/api/users/current`            | Get current user info               |
| GET    | `/api/users/details/{userId}`   | Get detailed user info              |
| PATCH  | `/api/users/avatars`            | Update user avatar                  |
| GET    | `/api/users/followers/{userId}` | Get user's followers                |
| GET    | `/api/users/following`          | Get users current user is following |
| POST   | `/api/users/follow/{userId}`    | Follow a user                       |
| DELETE | `/api/users/unfollow/{userId}`  | Unfollow a user                     |
| POST   | `/api/users/logout`             | Logout user                         |

---

### 📚 Categories – Manage categories

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/categories` | Get all categories |

---

### 🌍 Areas – Manage areas

| Method | Endpoint     | Description                       |
| ------ | ------------ | --------------------------------- |
| GET    | `/api/areas` | Get all areas (regions of origin) |

---

### 🧂 Ingredients – Manage ingredients

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | `/api/ingredients` | Get all ingredients |

---

### 📝 Recipes – Manage recipes

| Method | Endpoint                      | Description                                                    |
| ------ | ----------------------------- | -------------------------------------------------------------- |
| GET    | `/api/recipes/`               | Search recipes by ingredient name, area, category and paginate |
| GET    | `/api/recipes/myrecipes`      | Get user's own recipes                                         |
| GET    | `/api/recipes/popular`        | Get most popular recipes                                       |
| GET    | `/api/recipes/myfavorites`    | Get favorite recipes for current user                          |
| GET    | `/api/recipes/{id}`           | Get recipe by ID                                               |
| DELETE | `/api/recipes/{id}`           | Delete own recipe                                              |
| POST   | `/api/recipes`                | Create a new recipe                                            |
| POST   | `/api/recipes/{id}/favorites` | Add recipe to favorites                                        |
| DELETE | `/api/recipes/{id}/favorites` | Remove recipe from favorites                                   |

---

### 💬 Testimonials – Manage testimonials

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/testimonials` | Get all testimonials |

---

## 📚 Swagger Docs

Full documentation is available at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## ⚙️ Getting Started

```bash
git clone https://github.com/your-username/foodies-backend.git
cd foodies-backend
npm install
cp .env.example .env
npm run dev
```

