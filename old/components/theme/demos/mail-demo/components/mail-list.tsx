import { formatDistanceToNow } from "date-fns";
import { ComponentProps } from "react";

import { Mail } from "../data";
import { useMail } from "../use-mail";
import { Badge } from "../../../../ui/badge";
import { cn } from "../../../../../lib/utils";

interface MailListProps {
  items: Mail[];
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();

  return (
    <>
      {items.map((item) => (
        <button
          key={item.id}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
            mail.selected === item.id && "bg-muted",
          )}
          onClick={() =>
            setMail({
              ...mail,
              selected: item.id,
            })
          }
        >
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{item.name}</div>
                {!item.read && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
              <div
                className={cn(
                  "ml-auto text-xs",
                  mail.selected === item.id
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {formatDistanceToNow(new Date(item.date), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div className="text-xs font-medium">{item.subject}</div>
          </div>
          <div className="text-muted-foreground line-clamp-2 text-xs">
            {item.text.substring(0, 300)}
          </div>
          {item.labels.length ? (
            <div className="flex items-center gap-2">
              {item.labels.map((label) => (
                <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                  {label}
                </Badge>
              ))}
            </div>
          ) : null}
        </button>
      ))}
    </>
  );
}

function getBadgeVariantFromLabel(
  label: string,
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
