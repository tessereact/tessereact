"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNodeActive = isNodeActive;
exports.matchesQuery = matchesQuery;
var SEARCH_LIMIT = exports.SEARCH_LIMIT = 3;

function isNodeActive(selectedScenario, node) {
  return selectedScenario.name === node.name && selectedScenario.context === node.context;
}

function matchesQuery(searchQuery, string) {
  if (!searchQuery) return true;
  if (searchQuery.length < SEARCH_LIMIT) return true;
  return !!string.toLowerCase().match(searchQuery.toLowerCase());
}