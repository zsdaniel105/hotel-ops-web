let nextLayerId = 1;
const layers: number[] = [];

export function registerDialogLayer(): number {
  const id = nextLayerId;
  nextLayerId += 1;
  layers.push(id);
  document.body.style.overflow = "hidden";
  return id;
}

export function unregisterDialogLayer(id: number): void {
  const index = layers.indexOf(id);
  if (index >= 0) layers.splice(index, 1);
  if (!layers.length) document.body.style.overflow = "";
}

export function isTopDialogLayer(id: number): boolean {
  return layers[layers.length - 1] === id;
}
