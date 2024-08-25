import {
  ArabicWord,
  EgyptianWord,
  SerializedRes,
  TranslationRes,
} from './interface';

function symbolTranslator(sy: string) {
  const symbol = '0x' + sy;
  const entity = parseInt(symbol, 16);
  return `&#${entity};`;
}

export function controllDisplay(dis: boolean): void {
  const translationBox = document.getElementById(
    'translation-box',
  ) as HTMLDivElement;
  dis
    ? translationBox.classList.remove('hidden')
    : translationBox.classList.add('hidden');
}

export function generateText(
  object: ArabicWord[] | EgyptianWord[],
  isSymbol?: boolean,
): string {
  let text = '';
  if (isSymbol) {
    for (let values of object) {
      text = [values.Word, `${symbolTranslator(values.Symbol)}`].join('');
    }
    return text;
  } else {
    return object.map((object) => object.Word).join(' , ');
  }
}

function serializeRes(
  /*
   * @param ${transTo} access ${res} object, catch language user needed to transfer to
   * @param ${transFrom} access ${res} object, catch language user needed to transfer from
   * @return object contains two keys { to:[], from:[] }
   * */

  res: TranslationRes[],
  transTo: string,
  transFrom: string,
) {
  return res.map((response) => ({
    to: response[transTo as keyof TranslationRes] as
      | EgyptianWord[]
      | ArabicWord[],
    from: response[transFrom as keyof TranslationRes] as
      | EgyptianWord[]
      | ArabicWord[],
  }))[0];
}

export async function translation(
  transFrom: string,
  transTo: string,
  word: string,
): Promise<SerializedRes | null> {
  try {
    const url = 'http://localhost:3000';

    const response = await fetch(`${url}?lang=${transFrom}&word=${word}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch translation');
    }

    const res: TranslationRes[] = await response.json();

    if (res.length) {
      controllDisplay(true);
      return serializeRes(res, transTo, transFrom) as SerializedRes;
    } else {
      controllDisplay(false);
      return null;
    }
  } catch (error) {
    console.error('Error during translation:', error);
    return null;
  }
}
