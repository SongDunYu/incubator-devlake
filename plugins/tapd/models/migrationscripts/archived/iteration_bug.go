package archived

import (
	"github.com/merico-dev/lake/models/common"
	"github.com/merico-dev/lake/plugins/core"
)

type TapdIterationBug struct {
	common.NoPKModel
	ConnectionId   uint64 `gorm:"primaryKey"`
	IterationId    uint64 `gorm:"primaryKey"`
	WorkspaceID    uint64 `gorm:"primaryKey"`
	BugId          uint64 `gorm:"primaryKey"`
	ResolutionDate *core.CSTTime
	BugCreatedDate *core.CSTTime
}

func (TapdIterationBug) TableName() string {
	return "_tool_tapd_iteration_bugs"
}
