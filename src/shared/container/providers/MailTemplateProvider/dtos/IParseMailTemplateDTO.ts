interface ITemplateVariables {
  [key: string]: string | number;
  // Habilita a colocar quantos atributos eu quiser cujo a key seja uma string
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
