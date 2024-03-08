export const mock = <T>(options: Partial<T>): T => {
  return jest.fn(() => options as T)();
};
