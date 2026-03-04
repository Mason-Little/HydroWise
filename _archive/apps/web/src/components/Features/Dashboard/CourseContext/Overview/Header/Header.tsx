import { HeaderContact } from "./HeaderContact";
import { HeaderDates } from "./HeaderDates";
import { HeaderMeetings } from "./HeaderMeetings";

export const OverviewHeader = () => {
  return (
    <div className="flex w-full gap-2 *:flex-1">
      <HeaderMeetings />
      <HeaderDates />
      <HeaderContact />
    </div>
  );
};
