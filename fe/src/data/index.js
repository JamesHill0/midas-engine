import { AuthorizationViewModel } from "./authorization";
import { DashboardViewModel } from "./dashboard";
import { LoggerViewModel } from "./logger";
import { MappingViewModel } from "./mapping";
import { SchedulerViewModel } from "./scheduler";
import { IntegrationViewModel } from "./integration";
import { AccountViewModel } from "./account";

export default {
  Dashboard(url, config) {
    return new DashboardViewModel(url, config);
  },
  Authorization(url, config) {
    return new AuthorizationViewModel(url, config);
  },
  Logger(url, config) {
    return new LoggerViewModel(url, config);
  },
  Mapping(url, config) {
    return new MappingViewModel(url, config);
  },
  Scheduler(url, config) {
    return new SchedulerViewModel(url, config);
  },
  Integration(url, config) {
    return new IntegrationViewModel(url, config);
  },
  Account(url, config) {
    return new AccountViewModel(url, config);
  }
};
