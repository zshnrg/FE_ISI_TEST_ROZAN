'use client'

import { useToast } from "@/contexts/toastContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LogData } from "@/lib/types/log";
import { getLogs } from "@/lib/actions/logger";
import { Button } from "@/components/ui/buttton";

const NUM_LOG = 15;

export default function Log() {
    
    const { id } = useParams<{ id: string }>();

    const { toast } = useToast();

    const [logs, setLogs] = useState<LogData[]>([]);
    const [loading, setLoading] = useState(true);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        async function fetchLogs() {
            setLoading(true);
            await getLogs(parseInt(id), NUM_LOG, 0)
                .then((data) => {
                    if (!data) return;
                    setHasMore(data.length === NUM_LOG);
                    setLogs(data);
                })
                .catch((error) => {
                    toast(error.message, "error");
                })
                .finally(() => setLoading(false));
        }
        fetchLogs();
    }, [id, toast]);

    const loadMore = async () => {
        setLoading(true);
        await getLogs(parseInt(id), NUM_LOG, offset)
            .then((newData) => {
                if (!newData) return;
                setLogs((prev) => [...prev, ...newData]);
                setOffset((prev) => prev + NUM_LOG);
                setHasMore(newData.length === NUM_LOG);
            })
            .catch((error) => {
                toast(error.message, "error");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="flex w-full flex-col md:basis-2/3 gap-4 p-12">
            {
                (!loading || logs?.length > 0) && logs.map((log, index) => (
                    <div key={index} className="flex flex-col bg-neutral-50 p-4 rounded-lg">
                        <p className="text-lg text-neutral-500 dark:text-neutral-400">{log.log_message}</p>
                        <span className="text-md text-neutral-800 dark:text-neutral-200 leading-5">
                            By <span className="font-semibold">{log.user_full_name}</span>
                            {
                                log.task_name && <span> in task <span className="font-semibold">{log.task_name}</span></span>
                            }
                            </span>
                        <span className="text-sm mt-2 text-neutral-800 dark:text-neutral-200">
                            {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok', hour12: false }).format(log.log_created_at).replace(',', '')}
                        </span>
                    </div>
                ))
            }
            {
                !loading && logs.length === 0 && (
                    <span className="text-md font-medium text-left text-neutral-500 dark:text-neutral-400">No logs</span>
                )
            }
            {
                loading && Array.from({ length: NUM_LOG }).map((_, i) => (
                    <div key={i} className="animate-pulse h-24 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg overflow-hidden">
                    </div>
                ))
            }
            {
                hasMore && (
                    <Button
                        type="button"
                        onClick={loadMore}
                        buttonType="secondary"
                        className="w-full bg-white"
                        disabled={loading}
                    >
                        Load More
                    </Button>
                )
            }
        </div>
    );
}