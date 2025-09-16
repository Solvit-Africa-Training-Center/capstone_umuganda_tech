// import api from "./api";
// import { Project } from "../types";

import type { Project } from "../types";
import api from "./api";

export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get("/api/projects/projects/");
  return res.data;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const res = await api.post("/api/projects/projects/", data);
  return res.data;
};
