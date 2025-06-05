import { BlockViewer } from "../../block-viewer";
import { Mail } from "./components/mail";
import { accounts, mails } from "./data";

export function MailPage() {
  return <Mail accounts={accounts} mails={mails} navCollapsedSize={4} />;
}

export function MailDemo() {
  return (
    <BlockViewer name="mail" internalUrl={`/mail`}>
      <MailPage />
    </BlockViewer>
  );
}
