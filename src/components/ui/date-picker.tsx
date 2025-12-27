"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Matcher } from "react-day-picker";

interface DatePickerProps {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	disabledDays?: Matcher | Matcher[];
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Pick a date",
	disabled = false,
	className,
	disabledDays,
}: DatePickerProps) {
	const [date, setDate] = useState<Date | undefined>(value);
	const [open, setOpen] = useState(false);

	// Sync internal state with prop value if it changes externally
	useEffect(() => {
		setDate(value);
	}, [value]);

	const handleSelect = (newDate: Date | undefined) => {
		setDate(newDate);
		onChange(newDate);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left",
						!date && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "d MMMM, yyyy") : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleSelect}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
