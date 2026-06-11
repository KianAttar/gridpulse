/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetNodes {\n    nodes {\n      id\n      name\n      status\n      powerDraw\n      zone\n    }\n  }\n": typeof types.GetNodesDocument,
    "\n  query GetGridZones {\n    gridZones {\n      id\n      name\n      carbonIntensity\n      updatedAt\n      isEstimated\n    }\n  }\n": typeof types.GetGridZonesDocument,
    "\n  query GetEnergyForecast($zone: ZoneId!) {\n    energyForecast(zone: $zone) {\n      generatedAt\n      points {\n        time\n        solarRadiation\n        windSpeed\n      }\n    }\n  }\n": typeof types.GetEnergyForecastDocument,
    "\n  query RouteWorkload($k: Int! = 3, $zones: [ZoneId!]) {\n    routeWorkload(k: $k, zones: $zones) {\n      rank\n      cost\n      reason\n      node {\n        id\n        name\n        status\n        powerDraw\n        zone\n      }\n      zone {\n        id\n        name\n        carbonIntensity\n      }\n    }\n  }\n": typeof types.RouteWorkloadDocument,
};
const documents: Documents = {
    "\n  query GetNodes {\n    nodes {\n      id\n      name\n      status\n      powerDraw\n      zone\n    }\n  }\n": types.GetNodesDocument,
    "\n  query GetGridZones {\n    gridZones {\n      id\n      name\n      carbonIntensity\n      updatedAt\n      isEstimated\n    }\n  }\n": types.GetGridZonesDocument,
    "\n  query GetEnergyForecast($zone: ZoneId!) {\n    energyForecast(zone: $zone) {\n      generatedAt\n      points {\n        time\n        solarRadiation\n        windSpeed\n      }\n    }\n  }\n": types.GetEnergyForecastDocument,
    "\n  query RouteWorkload($k: Int! = 3, $zones: [ZoneId!]) {\n    routeWorkload(k: $k, zones: $zones) {\n      rank\n      cost\n      reason\n      node {\n        id\n        name\n        status\n        powerDraw\n        zone\n      }\n      zone {\n        id\n        name\n        carbonIntensity\n      }\n    }\n  }\n": types.RouteWorkloadDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetNodes {\n    nodes {\n      id\n      name\n      status\n      powerDraw\n      zone\n    }\n  }\n"): (typeof documents)["\n  query GetNodes {\n    nodes {\n      id\n      name\n      status\n      powerDraw\n      zone\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGridZones {\n    gridZones {\n      id\n      name\n      carbonIntensity\n      updatedAt\n      isEstimated\n    }\n  }\n"): (typeof documents)["\n  query GetGridZones {\n    gridZones {\n      id\n      name\n      carbonIntensity\n      updatedAt\n      isEstimated\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEnergyForecast($zone: ZoneId!) {\n    energyForecast(zone: $zone) {\n      generatedAt\n      points {\n        time\n        solarRadiation\n        windSpeed\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEnergyForecast($zone: ZoneId!) {\n    energyForecast(zone: $zone) {\n      generatedAt\n      points {\n        time\n        solarRadiation\n        windSpeed\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RouteWorkload($k: Int! = 3, $zones: [ZoneId!]) {\n    routeWorkload(k: $k, zones: $zones) {\n      rank\n      cost\n      reason\n      node {\n        id\n        name\n        status\n        powerDraw\n        zone\n      }\n      zone {\n        id\n        name\n        carbonIntensity\n      }\n    }\n  }\n"): (typeof documents)["\n  query RouteWorkload($k: Int! = 3, $zones: [ZoneId!]) {\n    routeWorkload(k: $k, zones: $zones) {\n      rank\n      cost\n      reason\n      node {\n        id\n        name\n        status\n        powerDraw\n        zone\n      }\n      zone {\n        id\n        name\n        carbonIntensity\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;