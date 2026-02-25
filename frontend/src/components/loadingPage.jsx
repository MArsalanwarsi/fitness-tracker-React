import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export function LoadingPage() {
    return (
        <>
            <div className="h-screen w-full flex items-center justify-center">
        <Empty className="w-full ">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Spinner className="size-12"/>
                </EmptyMedia>
                <EmptyTitle>Processing your request</EmptyTitle>
                <EmptyDescription>
                    Please wait while we process your request. Do not refresh the page.
                </EmptyDescription>
            </EmptyHeader>
                </Empty>
            </div>
        </>
    )
}
