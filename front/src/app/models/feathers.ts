export interface FeathersPassport {
  getJWT(): any;
  verifyJWT(token: string): Promise<any>;
}

export class Feathers {
  passport: FeathersPassport;
}

export class QueryResult<T> {
  public data: T[];
  public limit: number;
  public skip: number;
  public total: number;
}

export interface ISearchQuery {
  query: {};
}

export class SearchQueryGeo implements ISearchQuery {
  query: GeoQuery;
}

export class SearchQuery implements ISearchQuery {
  query: Query;
}

export class Query {
  public $limit = 0;
  public $skip = 0;
  public $sort?: {} = {};
  public $select?: string[] = [];
  public $or?: {}[] = [];
}

export class GeoQuery extends Query {
  public geo?: {};
}

export interface FeathersObject {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
