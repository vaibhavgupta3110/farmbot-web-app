import thunk from "redux-thunk";
import { applyMiddleware, compose, Middleware } from "redux";
import { EnvName } from "./interfaces";
import { Actions } from "../constants";
import { stateFetchMiddlewareConfig } from "./state_fetch_middleware";

export interface MiddlewareConfig {
  fn: Middleware;
  env: EnvName;
}

/** To make it easier to manage all things watching the state tree,
 * we keep subscriber functions in this array. */
export let mwConfig: MiddlewareConfig[] = [
  { env: "*", fn: thunk },
  { env: "development", fn: require("redux-immutable-state-invariant").default() },
  stateFetchMiddlewareConfig
];

export function getMiddleware(env: EnvName) {
  const middlewareFns = mwConfig
    .filter(function (mwc) { return (mwc.env === env) || (mwc.env === "*"); })
    .map((mwc) => mwc.fn);
  const wow = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  const dtCompose = wow && wow({
    actionsBlacklist: [
      Actions.NETWORK_EDGE_CHANGE,
      Actions.RESOURCE_READY
    ]
  });
  const composeEnhancers = dtCompose || compose;
  const middleware = applyMiddleware(...middlewareFns);

  return composeEnhancers(middleware);
}
