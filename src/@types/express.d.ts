/* eslint-disable @typescript-eslint/naming-convention */
// Sobrescreve uma definição de tipo da biblioteca
declare namespace Express {
  export interface Request {
    // Atributos adicionados aqui não vão substituir,
    // mas sim complementar a interface original da lib
    user: {
      id: string;
    };
  }
}
