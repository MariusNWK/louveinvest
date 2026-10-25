import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.locale("fr");
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Paris");

export function formatDateTime(date?: Date): string {
  return dayjs(date).tz("Europe/Paris").format("DD/MM/YYYY [à] HH:mm");
}

export function formatDate(date?: Date): string {
  return dayjs(date).tz("Europe/Paris").format("DD/MM/YYYY");
}
