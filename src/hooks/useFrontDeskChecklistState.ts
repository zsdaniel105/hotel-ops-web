"use client";
import {useCallback,useRef,useSyncExternalStore} from "react";
import {signChecklist,updateChecklistItem,updateGeneralNotes} from "@/lib/front-desk-checklist";
import {EMPTY_FRONT_DESK_CHECKLIST_STATE,loadFrontDeskChecklistState,saveFrontDeskChecklistState} from "@/lib/front-desk-checklist-storage";
import type {ChecklistItemOutcome,FrontDeskChecklistInstance,FrontDeskChecklistState,SignatureStroke} from "@/types/front-desk-checklist";
let snapshot:FrontDeskChecklistState|null=null;const subscribers=new Set<()=>void>();const subscribe=(f:()=>void)=>{subscribers.add(f);return()=>subscribers.delete(f)};const client=()=>snapshot??=loadFrontDeskChecklistState();const server=()=>EMPTY_FRONT_DESK_CHECKLIST_STATE;
function publish(s:FrontDeskChecklistState){snapshot=s;saveFrontDeskChecklistState(s);subscribers.forEach(f=>f());}
export function useFrontDeskChecklistState(){const state=useSyncExternalStore(subscribe,client,server);const stateRef=useRef(state);
stateRef.current=state;const commit=useCallback((s:FrontDeskChecklistState)=>{stateRef.current=s;publish(s);return s},[]);return{state,updateItem:useCallback((i:FrontDeskChecklistInstance,id:string,o:ChecklistItemOutcome,n?:string)=>commit(updateChecklistItem(stateRef.current,i,id,o,n)),[commit]),updateNotes:useCallback((i:FrontDeskChecklistInstance,n:string)=>commit(updateGeneralNotes(stateRef.current,i,n)),[commit]),sign:useCallback((i:FrontDeskChecklistInstance,n:string,s:SignatureStroke[])=>commit(signChecklist(stateRef.current,i,n,s)),[commit])};}
