package tasks

import (
	"encoding/json"
	"fmt"
	"github.com/merico-dev/lake/plugins/core"
	"github.com/merico-dev/lake/plugins/helper"
	"net/http"
	"net/url"
)

const RAW_TASK_TABLE = "tapd_api_tasks"

var _ core.SubTaskEntryPoint = CollectTasks

func CollectTasks(taskCtx core.SubTaskContext) error {
	data := taskCtx.GetData().(*TapdTaskData)
	logger := taskCtx.GetLogger()
	logger.Info("collect tasks")
	collector, err := helper.NewApiCollector(helper.ApiCollectorArgs{
		RawDataSubTaskArgs: helper.RawDataSubTaskArgs{
			Ctx: taskCtx,
			Params: TapdApiParams{
				SourceId: data.Source.ID,
				//CompanyId: data.Options.CompanyId,
				WorkspaceId: data.Options.WorkspaceId,
			},
			Table: RAW_TASK_TABLE,
		},
		ApiClient:   data.ApiClient,
		PageSize:    100,
		UrlTemplate: "tasks",
		Query: func(reqData *helper.RequestData) (url.Values, error) {
			query := url.Values{}
			query.Set("workspace_id", fmt.Sprintf("%v", data.Options.WorkspaceId))
			query.Set("page", fmt.Sprintf("%v", reqData.Pager.Page))
			query.Set("limit", fmt.Sprintf("%v", reqData.Pager.Size))
			return query, nil
		},
		GetTotalPages: GetTotalPagesFromResponse,
		ResponseParser: func(res *http.Response) ([]json.RawMessage, error) {
			var data struct {
				Stories []json.RawMessage `json:"data"`
			}
			err := helper.UnmarshalResponse(res, &data)
			return data.Stories, err
		},
	})
	if err != nil {
		logger.Error("collect task error:", err)
		return err
	}
	return collector.Execute()
}

var CollectTaskMeta = core.SubTaskMeta{
	Name:        "collectTasks",
	EntryPoint:  CollectTasks,
	Required:    true,
	Description: "collect Tapd tasks",
}
