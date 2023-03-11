<template>
    <main class="main">
        <el-divider></el-divider>
        <div class="flex items-start justify-between">
            <el-space class="scale-75 origin-left">
                DB: <el-link>{{ dbPath }}</el-link>
            </el-space>
            <el-space>
                <span class="text-sm">刷新间隔(ms)</span>
                <el-input-number v-model="appStore.stock.intervalUpdateMillisecond" :step="1000" :min="0"></el-input-number>
            </el-space>
        </div>
        <el-divider></el-divider>
        <el-form inline :model="listState.query">
            <el-form-item label="代码" clearable>
                <el-input v-model="listState.query.code" placeholder="代码" clearable/>
            </el-form-item>
            <el-form-item label="名称" clearable>
                <el-input v-model="listState.query.name" placeholder="名称" clearable/>
            </el-form-item>
            <el-form-item label="是否启用">
            <el-select v-model="listState.query.enabled" placeholder="是否启用" clearable>
                <template v-for="(option, idx) in [{label: '启用', value: 1}, {label: '未启用', value: 0}]" :key="idx">
                    <el-option :label="option.label" :value="option.value"></el-option>
                </template>
            </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="listState.isLoading" @click="listState.onLoad()">搜索</el-button>
                <el-button @click="listState.onLoad({pageNo: 1}, true)">重置</el-button>
            </el-form-item>
        </el-form>
        <el-form class="ops inline float-right" inline>
            <el-form-item>
                <el-button type="primary" @click="onNew">添加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="listState.list" stripe border row-key="id" style="width: 100%;">
            <el-table-column label="ID" prop="id" />
            <el-table-column label="代码" prop="code">
                <template #default="{row}">
                    <el-tag>{{ row.code }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" />
            <el-table-column label="价格" prop="price">
                <template #default="{row}">
                    <el-tag>{{ row.price }}</el-tag>
                </template>
            </el-table-column>
            <!-- <el-table-column label="价格更新与" prop="price_at" width="150" /> -->
            <el-table-column label="低价告警" prop="notice_lower_price">
                <template #default="{row}">
                    <el-tag>{{ row.notice_lower_price }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="高价告警" prop="notice_higher_price">
                <template #default="{row}">
                    <el-tag>{{ row.notice_higher_price }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" />
            <el-table-column label="告警开关" prop="enabled">
                <template #default="{row}">
                    <el-switch v-model="row.enabled" :active-value="1" :inactive-value="0" :loading="row.enableSwitching" inline-prompt active-text="Y" inactive-text="N" @change="(nv) => { updateEnableState(row, nv) }"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at" width="150" />
            <el-table-column label="更新时间" prop="updated_at" width="150" />
            <el-table-column label="操作" width="180">
                <template #default="{row}">
                    <el-space wrap>
                        <el-button @click="onEdit(row)">编辑</el-button>
                        <el-button type="danger" @click="onDelete(row)">删除</el-button>
                    </el-space>
                </template>
            </el-table-column>
        </el-table>
    </main>
</template>

<script>
import { defineComponent, reactive, toRefs, defineAsyncComponent, createVNode, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { sqliteDB } from '@/services'
import { useList } from '@/utils/hooks/useList'
import { useDialog } from '@/utils/hooks/useDialog'
import { useAppStore } from '@/stores/app'

export default defineComponent({
    setup() {
        const dialog = useDialog()
        const appStore = useAppStore()

        const listState = useList({
            onLoad: async ({ query, pagination }) => {
                const limit = pagination.pageSize
                const offset = (pagination.pageNo - 1) * pagination.pageSize
                let whereConditions = []
                let whereSegment = ''
                if (query.code) { whereConditions.push(`code = '${query.code}' --case-insensitive`) }
                if (query.name) { whereConditions.push(`name LIKE '%${query.name}%' --case-insensitive`) }
                if (query.enabled || query.enabled === 0) { whereConditions.push(`enabled = ${query.enabled}`) }
                if (whereConditions.length) {
                    whereSegment = ` WHERE ${whereConditions.join(" AND ")}`
                }
                listState.list = await sqliteDB.db.select(`select * from stocks${whereSegment} order by updated_at desc limit ${limit} offset ${offset};`)
                listState.pagination.totalCount = await database?.db.select(`select COUNT(*) as count from stocks${whereSegment};`)
            }
        })

        const state = reactive({
            dbPath: sqliteDB.dbPath,
            async updateEnableState(record, nvState) {
                record.enableSwitching = true
                const enabled = nvState ? 1 : 0
                const sql = `UPDATE stocks set enabled = $1, updated_at = datetime('now', 'localtime') where id = ${record.id}`
                const result = await sqliteDB.db.execute(sql, [enabled]).catch(e => {
                    ElNotification({title: '错误', message: `${e}`, type: 'error',})
                    throw(e)
                }).finally(() => {
                    record.enableSwitching = false
                });
                (state.tableRef)?.refreshData()
            },
            async onNew() {
                const instance = dialog.create({
                    title: '新增股票',
                    children: {
                        default: () => createVNode(defineAsyncComponent(() => import('./Form.vue')), {
                            onSubmit() {
                                instance.close()
                                listState.onLoad()
                            }
                        })
                    }
                })
            },
            async onEdit(record) {
                const instance = dialog.create({
                title: '编辑股票',
                children: {
                    default: () => createVNode(defineAsyncComponent(() => import('./Form.vue')), {
                    record,
                    onSubmit() {
                        listState.onLoad()
                        instance.close()
                    }
                    })
                }
                })
            },
            async onDelete(record) {
                await ElMessageBox.confirm('确定删除吗?', '确认', {confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning',})
                await sqliteDB.db.execute(`DELETE FROM stocks where id = $1;`, [record.id]).catch(e => {
                    ElNotification({title: '错误', message: `${e}`, type: 'error',})
                });
                listState.onLoad()
            }
        })

        let timeId = null
        let beginIntervalLoad = async () => {
            const intervalTime = appStore.stock.intervalUpdateMillisecond
            if (timeId) { 
                clearTimeout(timeId)
                timeId = null
            }
            try {
                await listState.onLoad()
            } finally {
                timeId = setTimeout(() => {
                    beginIntervalLoad?.()
                }, intervalTime)
            }
        }
        beginIntervalLoad()

        onBeforeUnmount(() => {
            beginIntervalLoad = null
            clearTimeout(timeId)
        })

        return {
            listState,
            appStore,
            ...toRefs(state)
        }
    }
})
</script>