import { Link, Navigate, Route, Routes } from "react-router-dom";
import { FinishedProjectsPage } from "./pages/FinishedProjectsPage.js";
import { PatternsPage } from "./pages/PatternsPage.js";
import { YarnProductsPage } from "./pages/YarnProductsPage.js";
import { YarnStashPage } from "./pages/YarnStashPage.js";

export const App = () => <><nav><Link to="/yarn-stash">Yarn stash</Link><Link to="/yarn-products">Yarn products</Link><Link to="/patterns">Patterns</Link><Link to="/finished-projects">Finished projects</Link></nav><main><Routes><Route path="/yarn-stash" element={<YarnStashPage />} /><Route path="/yarn-products" element={<YarnProductsPage />} /><Route path="/patterns" element={<PatternsPage />} /><Route path="/finished-projects" element={<FinishedProjectsPage />} /><Route path="*" element={<Navigate to="/yarn-stash" replace />} /></Routes></main></>;
