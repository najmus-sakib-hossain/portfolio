import { CardsActivityGoal } from "./activity-goal";
import { CardsCalendar } from "./calendar";
import { CardsDonationForm } from "./card-donation";
import { CardsChat } from "./chat";
import { CardsCookieSettings } from "./cookie-settings";
import { CardsCreateAccount } from "./create-account";
import { CardsDataTable } from "./data-table";
import { CardsMetric } from "./metric";
import { CardsPaymentMethod } from "./payment-method";
import { CardsReportIssue } from "./report-issue";
import { CardsShare } from "./share";
import { CardsStats } from "./stats";
import { CardsTeamMembers } from "./team-members";

export function CardsDemo() {
  return (
    <div className="@container">
      <div className="@3xl:grid-col-2 grid @3xl:gap-4 @5xl:grid-cols-10 @7xl:grid-cols-11 @7xl:gap-4">
        <div className="space-y-4 @5xl:col-span-4 @7xl:col-span-6 @7xl:space-y-4">
          <CardsStats />
          <div className="grid gap-1 @lg:grid-cols-[260px_1fr] @3xl:hidden">
            <CardsCalendar />
            <div className="pt-3 @lg:pt-0 @lg:pl-2 @7xl:pl-4">
              <CardsActivityGoal />
            </div>
            <div className="pt-3 @lg:col-span-2 @7xl:pt-4">
              <CardsMetric />
            </div>
          </div>
          <div className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-1 @7xl:grid-cols-2">
            <div className="space-y-4 @7xl:space-y-4">
              <CardsTeamMembers />
              <CardsCookieSettings />
              <CardsPaymentMethod />
            </div>
            <div className="space-y-4 @7xl:space-y-4">
              <CardsChat />
              <CardsCreateAccount />

              <div className="hidden @3xl:grid @5xl:hidden">
                <CardsDonationForm />
              </div>
              <div className="hidden @7xl:block">
                <CardsReportIssue />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 @5xl:col-span-6 @7xl:col-span-5 @7xl:space-y-4">
          <div className="hidden gap-1 @lg:grid-cols-[260px_1fr] @3xl:grid">
            <CardsCalendar />
            <div className="pt-3 @lg:pt-0 @lg:pl-2 @7xl:pl-3">
              <CardsActivityGoal />
            </div>
            <div className="pt-3 @lg:col-span-2 @7xl:pt-3">
              <CardsMetric />
            </div>
          </div>
          <div className="hidden @3xl:block">
            <CardsDataTable />
          </div>
          <CardsShare />
          <div className="@7xl:hidden">
            <CardsReportIssue />
          </div>
        </div>
      </div>
    </div>
  );
}
