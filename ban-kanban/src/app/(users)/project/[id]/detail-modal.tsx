'use client'

import { Button } from "@/components/ui/buttton";
import { Input, TextArea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MdClose } from "react-icons/md";
import { MemberItem } from "@/components/ui/member";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useToast } from "@/contexts/toastContext";
import { useParams } from "next/navigation";

import { Member } from "@/lib/types/user";
import { Loading } from "@/components/ui/loading";
import { getMembers } from "@/lib/actions/member";


export default function NewTasktModal({ disclosure }: { disclosure: ReturnType<typeof useDisclosure> }) {
    
    return loading ? (<Loading/>) : (
        <Modal
            {...disclosure}
            title="Create a new project"
            size="xl"
        >
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{project.project_name}</h4>
                
                <span className={`text-xs text-neutral-50   ${project.project_status ? "bg-green-500 dark:text-neutral-900" : "bg-neutral-400 dark:bg-neutral-500"} px-2 py-1 rounded-full`}>
                    {project.project_status ? "Active" : "Inactive"}
                </span>
            </div>
                
                {/* Description */}
                <TextArea
                    className="min-h-24"
                    id="description" name="description" type="text"
                    placeholder="Project description"
                />

                <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

                {/* members */}
                <div className="relative py-4 px-6 bg-neutral-100 dark:bg-neutral-700/20 rounded-4xl has-focus:ring-2 has-focus:ring-indigo-900 has-focus:ring-opacity-50 flex flex-wrap items-center gap-4">
                    {
                        formData.assigned_user.length > 0 && (
                            formData.assigned_user.map((user) => (
                                <div className="flex w-fit gap-2 p-2 bg-neutral-50 rounded-lg text-md text-neutral-800 dark:text-neutral-200" key={user.user_id}>
                                    {user.user_full_name}
                                    <MdClose onClick={() => handleRemoveMember(user.user_id)} className="cursor-pointer"/>
                                </div>
                            ))
                        )
                    }
                    <input
                        className="focus:outline-none w-full text-md text-neutral-800 dark:text-neutral-200"
                        type="text"
                        placeholder="Search member to assign"
                        value={searchMember}
                        onChange={(e) => setSearchMember(e.target.value)}
                    />
                        <div hidden={filtermembers.length === 0} className="absolute top-16 inset-x-0 w-full space-y-4 py-4 bg-neutral-100 shadow-xl dark:bg-neutral-800 rounded-xl max-h-48 overflow-y-auto">
                            {
                                filtermembers.map((member) => (
                                    <MemberItem
                                        key={member.user_id}
                                        member={member}
                                        onClick={() => handlePickMember(member.user_id)}
                                    />
                                ))
                            }
                        </div>
                </div>

                {/* Start and End Date */}
                <div className="flex gap-4 items-center">
                    <Input
                        id="start_date" name="start_date" type="datetime-local"
                        defaultValue={new Date().toISOString().substring(0, 11).concat("08:00")}
                        placeholder="Start Date" className="w-full text-sm"
                    />
                    <div className="w-4 h-1 bg-neutral-300 dark:bg-neutral-500 rounded-full shrink-0"></div>
                    <Input
                        id="end_date" name="end_date" type="datetime-local"
                        defaultValue={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().substring(0, 11).concat("08:00")}
                        placeholder="End Date" className="w-full text-sm"
                    />
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-4 mt-12">
                    <Button buttonType="secondary" type="button" onClick={disclosure.onClose}>
                        Cancel
                    </Button>
                    <Button 
                        buttonType="primary" className="w-full"
                    >
                        Create
                    </Button>
                </div>

            </div>
        </Modal>
    );
}