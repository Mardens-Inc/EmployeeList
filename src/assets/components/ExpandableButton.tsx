import {Button, ButtonProps, cn} from "@heroui/react";

export default function ExpandableButton(props: ButtonProps)
{
    const startContent = props.startContent;
    props = {...props, startContent: undefined};
    return (
        <Button
            className={
                cn(
                    "max-w-[50px] min-w-0 w-fit overflow-hidden !transition-[max-width] duration-200",
                    "data-[hover=true]:max-w-[200px]",
                    props.className
                )
            }
            {...props}
        >
            <div className={"flex flex-row items-center justify-center group transition-all duration-200"}>
                {startContent}
                <span
                    className={
                        cn(
                            "max-w-0 overflow-hidden opacity-0 whitespace-nowrap text-overflow-ellipsis transition-all duration-200",
                            "group-data-[hover=true]:max-w-[unset] group-data-[hover=true]:opacity-100 group-data-[hover=true]:ml-4"
                        )
                    }
                >
                {props.children}
            </span>
            </div>
        </Button>
    );
}