// Ordre classique d'introduction des sons au CP. Il dépend de la méthode de lecture :
// à ajuster si l'école suit un autre ordre.
export const SOUND_ORDER = ['a', 'i', 'o', 'u', 'e', 'é', 'l', 'r', 'm', 's', 'f', 'n', 't', 'p', 'd', 'b'];

// Ce que la voix du navigateur doit dire pour produire le son de chaque lettre.
// Les consonnes n'y sont pas : la voix dirait leur nom (« bé »), pas leur son. Il faudra des enregistrements.
export const SPOKEN_SOUNDS = { a: 'a', i: 'i', o: 'o', u: 'u', e: 'eu', é: 'é' };
