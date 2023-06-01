import React, { useEffect, useState, lazy, Suspense } from "react";

import LazyLoadFallbackComponent from "../shared/lazy-load-fallback/lazy-load-fallback.component.jsx";
import { loadAspects } from "../../helpers/codex/aspects-loader.js";
import Tags from "../../data/tags/tags.js";

import classIconBarbarian from "../../assets/icons/class-icon-barbarian.webp";
import classIconNecromancer from "../../assets/icons/class-icon-necromancer.webp";
import classIconSorcerer from "../../assets/icons/class-icon-sorcerer.webp";
import classIconRogue from "../../assets/icons/class-icon-rogue.webp";
import classIconDruid from "../../assets/icons/class-icon-druid.webp";

import "./aspects.styles.scss";

const Aspect = lazy(() => import("../aspect/aspect.component.jsx"));

const AspectsComponent = () => {
  const [aspects, setAspects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const classes = ["Barbarian", "Necromancer", "Sorcerer", "Rogue", "Druid"];
  const [searchTerm, setSearchTerm] = useState("");
  const tagsArray = Object.keys(Tags).map((key) => Tags[key]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const classIcons = {
    Barbarian: classIconBarbarian,
    Necromancer: classIconNecromancer,
    Sorcerer: classIconSorcerer,
    Rogue: classIconRogue,
    Druid: classIconDruid,
  };

  useEffect(() => {
    let allAspects = loadAspects();
    console.log("aspects count -> ", allAspects.length);
    setAspects(allAspects);
  }, []);

  const handleClassFilter = (className) => {
    setSelectedClasses((prevClasses) => {
      return prevClasses.includes(className)
        ? prevClasses.filter((classItem) => classItem !== className)
        : [...prevClasses, className];
    });
  };

  const renderAspects = () => {
    let filteredAspects = aspects;

    // Class filter
    if (selectedClasses.length !== 0) {
      filteredAspects = filteredAspects.filter((aspect) =>
        selectedClasses.includes(aspect.class)
      );
    }

    // Search filter
    if (searchTerm !== "") {
      filteredAspects = filteredAspects.filter((aspect) =>
        matchAspects(aspect, searchTerm)
      );
    }

    // Tag filter
    if (selectedTags.length !== 0) {
      filteredAspects = filteredAspects.filter((aspect) =>
        selectedTags.every((tag) =>
          Object.values(aspect).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    return filteredAspects.map((aspect, index) => (
      <Suspense
        fallback={<LazyLoadFallbackComponent text="Loading Aspect..." />}
        key={index}
      >
        <Aspect data={aspect} />
      </Suspense>
    ));
  };

  const matchAspects = (aspect, term) => {
    term = term.toLowerCase();
    // Convert the aspect object to a string and search within it
    const aspectString = JSON.stringify(aspect).toLowerCase();
    return aspectString.includes(term);
  };

  const handleTagChange = (tagName) => {
    setSelectedTags((prevTags) => {
      return prevTags.includes(tagName)
        ? prevTags.filter((tag) => tag !== tagName)
        : [...prevTags, tagName];
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleTagSelectReset = () => {
    setSelectedTags([]);
  };

  return (
    <div className="aspects-page">
      <div className="aspects-navbar">
        <div className="aspects-nav-left">
          <div className="aspects-title-container">
            <h2>Diablo 4 Legendary & Codex Aspects</h2>
          </div>
        </div>
        <div className="aspects-nav-right"></div>
      </div>
      <div className="aspects-container">
        <div className="aspects-content">
          <div className="aspects-header-container"></div>
          <div className="aspects-header-container-center"></div>
          <div className="aspects-content-bg-container"></div>
          <div className="aspects-filter inner-panel">
            <ul className="aspects-class-list">
              {classes.map((className, index) => (
                <li
                  key={index}
                  onClick={() => handleClassFilter(className)}
                  className={
                    selectedClasses.includes(className)
                      ? "list-item class-selected"
                      : "list-item"
                  }
                >
                  <img src={classIcons[className]} alt={className} />
                  <span>{className}</span>
                </li>
              ))}
            </ul>
            <div className="aspects-search-filter-container">
              <div className="search-container filter-search">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search skills..."
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  >
                    &times;
                  </button>
                )}
              </div>
              <div className="aspects-tag-filter">
                <button
                  className="d4-button-mini filter-button"
                  onClick={toggleDropdown}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-2 -12 72 72"
                    id="filter"
                    width="40"
                    height="40"
                  >
                    <path
                      d="M4 10h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2H22.91A6 6 0 0 0 11.09 8H4a1 1 0 0 0 0 2zM17 5a4 4 0 1 1-4 4A4 4 0 0 1 17 5zM44 23H36.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2H25.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM31 28a4 4 0 1 1 4-4A4 4 0 0 1 31 28zM44 38H22.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM17 43a4 4 0 1 1 4-4A4 4 0 0 1 17 43z"
                      data-name="Layer 15"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            {dropdownOpen && (
              <div className="filter-dropdown-container">
                <button
                  className="d4-button-mini tag-reset"
                  onClick={handleTagSelectReset}
                >
                  &times;
                </button>
                <ul>
                  {tagsArray.map((tag, index) => (
                    <li className="tag-filter-item" key={index}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleTagChange(tag.name);
                        }}
                        className={
                          selectedTags.includes(tag.name)
                            ? "aspect-filters-check tag-selected"
                            : "aspect-filters-check"
                        }
                      >
                        {tag.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="aspects-list-container inner-panel">
            <ul>{renderAspects()}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspectsComponent;
