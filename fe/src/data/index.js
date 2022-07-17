import { AuthorizationViewModel } from "./authorization";
import { DashboardViewModel } from "./dashboard";
import { LoggerViewModel } from "./logger";
import { MappingViewModel } from "./mapping";
import { SchedulerViewModel } from "./scheduler";
import { IntegrationViewModel } from "./integration";

export default {
  Dashboard(url) {
    return new DashboardViewModel(url);
  },
  Authorization(url) {
    return new AuthorizationViewModel(url);
  },
  Logger(url) {
    return new LoggerViewModel(url);
  },
  Mapping(url) {
    return new MappingViewModel(url);
  },
  Scheduler(url) {
    return new SchedulerViewModel(url);
  },
  Integration(url) {
    return new IntegrationViewModel(url);
  }
};
