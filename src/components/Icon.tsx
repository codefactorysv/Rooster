import {
  TreeDeciduous,
  Disc3,
  Sprout,
  LayoutGrid,
  Layers,
  Flower2,
  AlertTriangle,
  CalendarCheck,
  Fence,
  SprayCan,
  Truck,
  Leaf,
  Scissors,
  Clock,
  ShieldCheck,
  ClipboardCheck,
  Wrench,
  Building2,
  Languages,
  Phone,
  Mail,
  Check,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/content";

const iconMap: Record<IconName, React.ComponentType<LucideProps>> = {
  tree: TreeDeciduous,
  stump: Disc3,
  lawn: Sprout,
  sod: LayoutGrid,
  mulch: Layers,
  flower: Flower2,
  emergency: AlertTriangle,
  maintenance: CalendarCheck,
  fence: Fence,
  wash: SprayCan,
  hauling: Truck,
  leaf: Leaf,
  shears: Scissors,
  clock: Clock,
  shield: ShieldCheck,
  estimate: ClipboardCheck,
  equipment: Wrench,
  building: Building2,
  language: Languages,
  phone: Phone,
  mail: Mail,
  check: Check,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = iconMap[name];
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
