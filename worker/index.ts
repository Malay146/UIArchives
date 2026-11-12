import app from "vinext/server/fetch-handler";
import { runAutomation } from "../lib/server/automation";

/**
 * The Worker: vinext serves the site; `scheduled` runs the automation that
 * gathers new candidates into the review queue.
 */
export default {
  ...app,
  async scheduled(controller: ScheduledController, _env: unknown, ctx: ExecutionContext) {
    ctx.waitUntil(runAutomation(controller.cron));
  },
};
