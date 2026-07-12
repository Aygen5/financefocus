import initialDb from "../../db.json";

export const initializeLocalStorageDb = () => {
  const keys = [
    "transactions",
    "budget",
    "portfolio",
    "goals",
    "subscriptions",
    "notifications",
    "activities",
    "settings",
  ];

  const currentDbVersion = localStorage.getItem("financefocus_db_version");
  if (currentDbVersion !== "v3") {
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.setItem("financefocus_db_version", "v3");
  }

  keys.forEach((key) => {
    if (!localStorage.getItem(key)) {
      const data = initialDb[key as keyof typeof initialDb];
      localStorage.setItem(key, JSON.stringify(data));
    }
  });
};

export const getLocalData = (key: string): unknown => {
  initializeLocalStorageDb();
  // Map standard endpoints to storage keys
  let mappedKey = key.replace(/^\//, "").split("?")[0];
  if (mappedKey === "budgets") mappedKey = "budget";
  if (mappedKey === "activities") mappedKey = "activities";

  const data = localStorage.getItem(mappedKey);
  return data ? JSON.parse(data) : [];
};

export const saveLocalData = (key: string, data: unknown) => {
  let mappedKey = key.replace(/^\//, "").split("?")[0];
  if (mappedKey === "budgets") mappedKey = "budget";
  if (mappedKey === "activities") mappedKey = "activities";

  localStorage.setItem(mappedKey, JSON.stringify(data));
};
