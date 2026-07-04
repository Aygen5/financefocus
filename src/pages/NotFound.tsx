import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">NotFound</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Bu sayfa henüz geliştirilme aşamasındadır.
      </p>
    </div>
  );
};

export default NotFound;
