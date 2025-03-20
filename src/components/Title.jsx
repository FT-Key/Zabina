import React from "react";
import "../css/Title.css";

const Title = ({ type = "h1", highlight = false, className = "", children }) => {
  const validTypes = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const Tag = validTypes.includes(type) ? type : "h1"; // Restringe a etiquetas válidas

  return (
    <Tag className={`${className} ${highlight ? "highlight" : ""}`.trim()}>
      {children}
    </Tag>
  );
};

export default Title;