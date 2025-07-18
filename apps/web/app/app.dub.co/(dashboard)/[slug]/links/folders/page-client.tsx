"use client";

import { unsortedLinks } from "@/lib/folder/constants";
import useFolders from "@/lib/swr/use-folders";
import useFoldersCount from "@/lib/swr/use-folders-count";
import { Folder } from "@/lib/types";
import { FOLDERS_MAX_PAGE_SIZE } from "@/lib/zod/schemas/folders";
import { FolderCard } from "@/ui/folders/folder-card";
import { FolderCardPlaceholder } from "@/ui/folders/folder-card-placeholder";
import { useAddFolderModal } from "@/ui/modals/add-folder-modal";
import { SearchBoxPersisted } from "@/ui/shared/search-box";
import { PaginationControls, usePagination, useRouterStuff } from "@dub/ui";
import { useSearchParams } from "next/navigation";

const allLinkFolder: Folder = {
  type: "default",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...unsortedLinks,
};

export const FoldersPageClient = () => {
  const searchParams = useSearchParams();
  const { queryParams } = useRouterStuff();

  const { folders, loading, isValidating } = useFolders({
    includeParams: ["search", "page"],
  });

  const { data: foldersCount } = useFoldersCount({
    includeParams: ["search", "page"],
  });

  const showAllLinkFolder =
    !searchParams.get("search") || folders?.length === 0;

  const { pagination, setPagination } = usePagination(FOLDERS_MAX_PAGE_SIZE);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid gap-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto">
          <div className="w-full md:w-56 lg:w-64">
            <SearchBoxPersisted
              loading={isValidating}
              onChangeDebounced={(t) => {
                if (t) {
                  queryParams({ set: { search: t }, del: "page" });
                } else {
                  queryParams({ del: "search" });
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <FolderCardPlaceholder key={idx} />
            ))
          ) : (
            <>
              {showAllLinkFolder && <FolderCard folder={allLinkFolder} />}
              {folders?.map((folder) => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 rounded-b-[inherit] border-t border-neutral-200 bg-white px-3.5 py-2">
        <PaginationControls
          pagination={pagination}
          setPagination={setPagination}
          totalCount={foldersCount || 0}
          unit={(p) => `folder${p ? "s" : ""}`}
        />
      </div>
    </div>
  );
};

export function FoldersPageControls() {
  const { AddFolderButton, AddFolderModal } = useAddFolderModal();

  return (
    <>
      <AddFolderModal />
      <AddFolderButton />
    </>
  );
}
