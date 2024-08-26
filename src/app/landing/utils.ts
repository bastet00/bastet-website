import {
  OmitIDResponse,
  RenameResponseKeys,
  TranslationRes,
} from './interface';

export function symbolTranslator(sy: string) {
  const symbol = '0x' + sy;
  const entity = parseInt(symbol, 16);
  return `&#${entity};`;
}

export function controllDisplay(dis: boolean): void {
  const translationBox = document.getElementById(
    'translation-box',
  ) as HTMLDivElement;
  if (dis) translationBox.classList.remove('hidden');
  if (!dis) translationBox.classList.add('hidden');
}

function renameKeys(
  resObject: TranslationRes,
  to: string,
  from: string,
): RenameResponseKeys {
  /*
   * @param ${to} access ${resObject} object, catch language user needed to transfer to
   * @param ${from} access ${resObject} object, catch language user needed to transfer from
   * @return object contains two keys { to:[], from:[] }
   * */
  return Object.assign(
    {},
    {
      ['to']: resObject[to as keyof OmitIDResponse],
      ['from']: resObject[from as keyof OmitIDResponse],
    },
  );
}

export async function translation(
  to: string,
  from: string,
  word: string,
): Promise<RenameResponseKeys | void> {
  try {
    const url = 'https://bastet-server-ef94bb4e91eb.herokuapp.com/search';

    const response = await fetch(`${url}?lang=${from}&word=${word}`, {
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
      return renameKeys(res[0], to, from);
    } else {
      controllDisplay(false);
    }
  } catch (err) {
    console.error('Error during translation:', err);
  }
}
