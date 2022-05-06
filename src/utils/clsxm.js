import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function clsxm(...classes) {
  return twMerge(clsx(...classes));
}
