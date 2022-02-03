import { List } from "immutable";
import { pipe } from "pipe-ts";
import { Log, LogContent, LogContents } from "../types/domain";
import { map } from "./data-structures";

const sanitizeDateStr = (rawData: string) => rawData.replace("s", "")

const sanitizeDate = (rawDate: string) =>
  (Number(Number(sanitizeDateStr(rawDate)).toFixed(3)) * 1000);

const parseLog = ([rawDate, log, resource]: LogContent): Log =>
  List([sanitizeDate(rawDate), log, Number(resource)]);
const filterUndefined = ([rawDate, log, resource]: LogContent): boolean =>
  !!resource && !!log && !!rawDate;

export const parseLogs = (logs: LogContents) =>
  List(logs).map(parseLog).filter(filterUndefined).reverse();
