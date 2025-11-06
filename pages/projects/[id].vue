
<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">项目交接清单管理：{{ project?.name }}</h1>
    <div v-if="errorMsg" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">保存失败：</strong>
      <span class="block sm:inline">{{ errorMsg }}</span>
    </div>
    <div v-if="successMsg" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{{ successMsg }}</span>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-8 divide-y divide-gray-200">
          <div v-for="(item, key) in projectData" :key="key" class="pt-8 first:pt-0">
            <h3 class="text-lg leading-6 font-medium text-gray-900">{{ item.label }}</h3>
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
              <div class="sm:col-span-2">
                <select v-model="item.status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>待定</option>
                  <option>已上传</option>
                  <option>无需上传</option>
                </select>
              </div>
              <div class="sm:col-span-4">
                <div v-if="item.file_url">
                  <a :href="item.file_url" target="_blank" class="text-indigo-600 hover:text-indigo-900 font-medium break-all">{{ item.file_name }}</a>
                  <button @click="removeFile(key)" class="ml-4 text-red-500 hover:text-red-700 text-sm">删除</button>
                </div>
                <input v-else type="file" @change="handleFileChange($event, key)" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <NuxtLink to="/projects" class="mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">返回项目列表</NuxtLink>
        <button @click="saveProject" :disabled="isSaving" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
          {{ isSaving ? '保存中...' : '保存更改' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const projectId = route.params.id;
const project = ref(null);
const projectData = ref({});
const filesToUpload = ref({});

const errorMsg = ref('');
const successMsg = ref('');
const isSaving = ref(false);

const fetchData = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    errorMsg.value = '加载项目数据失败: ' + error.message;
  } else {
    project.value = data;
    // 确保即使 data.data 为空，也使用默认结构初始化
    const defaultStructure = {
      security: { label: '安规要求', status: '待定', file_name: null, file_url: null },
      compliance: { label: '合规要求', status: '待定', file_name: null, file_url: null },
      certification: { label: '认证要求', status: '待定', file_name: null, file_url: null },
      third_party: { label: '第三方:安规/合规/认证证书', status: '待定', file_name: null, file_url: null },
    };
    projectData.value = { ...defaultStructure, ...data.data };
  }
};

onMounted(fetchData);

const handleFileChange = (event, key) => {
  const file = event.target.files[0];
  if (file) {
    filesToUpload.value[key] = file;
    projectData.value[key].file_name = file.name; // 立即显示文件名
    projectData.value[key].status = '已上传'; // 自动更新状态
  }
};

const removeFile = (key) => {
  // 只是在前端移除，保存时才会真正删除
  projectData.value[key].file_url = null;
  projectData.value[key].file_name = null;
  filesToUpload.value[key] = null; // 清除待上传文件
}

const saveProject = async () => {
  isSaving.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    // 1. 上传所有新文件
    for (const key in filesToUpload.value) {
      const file = filesToUpload.value[key];
      if (file) {
        const filePath = `${projectId}/${key}-${Date.now()}-${file.name}`;
        
        // 直接使用 supabase-js 上传
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`文件 ${file.name} 上传失败: ${uploadError.message}`);
        }

        // 获取上传后的公开 URL
        const { data: urlData } = supabase.storage
          .from('project-files')
          .getPublicUrl(filePath);

        projectData.value[key].file_url = urlData.publicUrl;
        projectData.value[key].file_name = file.name;
      }
    }

    // 2. 更新数据库中的项目 data 字段
    const { error: dbError } = await supabase
      .from('projects')
      .update({ data: projectData.value })
      .eq('id', projectId);

    if (dbError) {
      throw new Error('更新项目数据库失败: ' + dbError.message);
    }

    successMsg.value = '项目保存成功！';
    filesToUpload.value = {}; // 清空待上传列表
  } catch (e) {
    errorMsg.value = e.message;
  } finally {
    isSaving.value = false;
  }
};
</script>
