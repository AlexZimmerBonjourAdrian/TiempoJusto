import { useCallback, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';

export const useProjects = () => {
    const { projects, projectIdToTaskCount, addProject, completeProject, removeProject } = useAppContext();

    const byId = useMemo(() => (projects || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {}), [projects]);

    const create = useCallback(async (data) => addProject(data), [addProject]);
    const complete = useCallback(async (id) => completeProject(id), [completeProject]);
    const remove = useCallback(async (id) => removeProject(id), [removeProject]);

    return { list: projects || [], byId, taskCount: projectIdToTaskCount || {}, create, complete, remove };
};


