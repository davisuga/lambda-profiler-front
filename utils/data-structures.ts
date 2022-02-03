export * from "immutable";

type Map = <A, B>(fn: (x: A) => B) => Functor<B>;

type Functor<A> = {
  map: <B>(fn: (x: A) => B) => Functor<B>;
};

export const map =
  <A, R>(f: (arg: A) => R) =>
  (arr: Functor<A>) =>
    arr.map(f);
