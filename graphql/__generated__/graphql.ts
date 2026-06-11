/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type NodeStatus =
  | 'IDLE'
  | 'OFFLINE'
  | 'ONLINE';

export type ZoneId =
  | 'CA_BC'
  | 'CA_ON'
  | 'DE'
  | 'US_TEX_ERCO';

export type GetNodesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNodesQuery = { nodes: Array<{ id: string, name: string, status: NodeStatus, powerDraw: number, zone: ZoneId }> };

export type GetGridZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridZonesQuery = { gridZones: Array<{ id: ZoneId, name: string, carbonIntensity: number, updatedAt: string, isEstimated: boolean }> };

export type GetEnergyForecastQueryVariables = Exact<{
  zone: ZoneId;
}>;


export type GetEnergyForecastQuery = { energyForecast: { generatedAt: string, points: Array<{ time: string, solarRadiation: number, windSpeed: number }> } };

export type RouteWorkloadQueryVariables = Exact<{ [key: string]: never; }>;


export type RouteWorkloadQuery = { routeWorkload: { reason: string, node: { id: string, name: string, status: NodeStatus, powerDraw: number, zone: ZoneId }, zone: { id: ZoneId, name: string, carbonIntensity: number } } };


export const GetNodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"powerDraw"}},{"kind":"Field","name":{"kind":"Name","value":"zone"}}]}}]}}]} as unknown as DocumentNode<GetNodesQuery, GetNodesQueryVariables>;
export const GetGridZonesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridZones"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridZones"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"carbonIntensity"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEstimated"}}]}}]}}]} as unknown as DocumentNode<GetGridZonesQuery, GetGridZonesQueryVariables>;
export const GetEnergyForecastDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEnergyForecast"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ZoneId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"energyForecast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"zone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zone"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"solarRadiation"}},{"kind":"Field","name":{"kind":"Name","value":"windSpeed"}}]}}]}}]}}]} as unknown as DocumentNode<GetEnergyForecastQuery, GetEnergyForecastQueryVariables>;
export const RouteWorkloadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RouteWorkload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"routeWorkload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"powerDraw"}},{"kind":"Field","name":{"kind":"Name","value":"zone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"carbonIntensity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<RouteWorkloadQuery, RouteWorkloadQueryVariables>;