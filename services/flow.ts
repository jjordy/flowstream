import { flow } from "../db/data-repositories/flow";

export const FlowService = {
  async getById(id: string) {
    if (!id) {
      return { error: "id is required" };
    }
    try {
      const results = await flow.findFlowById(id);
      return { results, error: null };
    } catch (error) {
      return { error };
    }
  },
};
