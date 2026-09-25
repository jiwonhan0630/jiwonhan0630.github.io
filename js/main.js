        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-HNMCRKEZB8');

        let mermaidLoadPromise = null;

        function loadMermaid() {
            if (window.mermaid) return Promise.resolve(window.mermaid);
            if (!mermaidLoadPromise) {
                mermaidLoadPromise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'js/lib/mermaid.min.js';
                    script.onload = () => {
                        window.mermaid.initialize({
                            startOnLoad: false,
                            theme: 'dark',
                            layout: 'dagre',
                            look: 'classic'
                        });
                        resolve(window.mermaid);
                    };
                    script.onerror = () => reject(new Error('Mermaid 스크립트를 불러오지 못했습니다.'));
                    document.head.appendChild(script);
                });
            }
            return mermaidLoadPromise;
        }

        function renderMermaidDiagrams(root = document) {
            const diagrams = root.querySelectorAll('.mermaid');
            if (diagrams.length === 0) return;

            loadMermaid()
                .then(mermaid => mermaid.run({ nodes: diagrams }))
                .catch(error => console.error('Mermaid 다이어그램 렌더링 실패:', error));
        }

        // 트러블슈팅의 각 최상위 항목을 가변 높이 타임라인 단계로 구성합니다.
        function buildTroubleTimelines(root = document) {
            root.querySelectorAll('.trouble-content').forEach(content => {
                if (content.querySelector(':scope > .trouble-step')) return;

                const children = Array.from(content.children);
                let currentStep = null;

                children.forEach(child => {
                    if (child.tagName === 'H4') {
                        currentStep = document.createElement('section');
                        currentStep.className = 'trouble-step';
                        content.insertBefore(currentStep, child);
                    }

                    if (currentStep) currentStep.appendChild(child);
                });
            });
        }

        // 탭 및 프로젝트 상세 라우팅 (예: #/projects, #/project/projectpz)
        const TAB_IDS = ['highlights', 'projects', 'about'];
        const PROJECT_ROUTE_NAME = 'project';
        const HIGHLIGHT_ROUTE_NAME = 'highlight';
        const projectDetail = document.getElementById('project-detail');
        const projectDetailTitle = document.getElementById('project-detail-title');
        const projectDetailBodyTitle = document.getElementById('project-detail-body-title');
        const projectDetailPeriod = document.getElementById('project-detail-period');
        const projectDetailTags = document.getElementById('project-detail-tags');
        const projectDetailContent = document.getElementById('project-detail-content');
        const projectBackButtons = document.querySelectorAll('[data-project-back]');
        let lastRenderedRoute = null;
        let restoreScrollFrame = null;

        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

        function decodeRoutePart(value) {
            try {
                return decodeURIComponent(value);
            } catch {
                return value;
            }
        }

        function buildProjectHash(projectId, highlightId = '') {
            const routeParts = [PROJECT_ROUTE_NAME, encodeURIComponent(projectId)];
            if (highlightId) {
                routeParts.push(HIGHLIGHT_ROUTE_NAME, encodeURIComponent(highlightId));
            }
            return `#/${routeParts.join('/')}`;
        }

        function parseRoute() {
            const rawHash = window.location.hash.replace(/^#\/?/, '');
            // 새 URL은 '/'로 나누고, 기존에 공유된 '#project#id' URL도 읽을 수 있게 처리합니다.
            const routeParts = rawHash.includes('#') ? rawHash.split('#') : rawHash.split('/');

            if (routeParts[0] === PROJECT_ROUTE_NAME) {
                const projectId = decodeRoutePart(routeParts[1] || '');
                const template = document.getElementById(`temp-${projectId}`);
                const isProjectRoute = routeParts.length === 2;
                const isHighlightRoute = routeParts.length === 4
                    && routeParts[2] === HIGHLIGHT_ROUTE_NAME;

                if (template && (isProjectRoute || isHighlightRoute)) {
                    const elementId = isHighlightRoute ? decodeRoutePart(routeParts[3]) : null;
                    if (!elementId || document.getElementById(elementId)) {
                        return { type: 'project', projectId, elementId };
                    }
                }
                return { type: 'tab', id: 'projects' };
            }

            return {
                type: 'tab',
                id: TAB_IDS.includes(rawHash) ? rawHash : 'highlights'
            };
        }

        function routeKey(route) {
            if (route.type === 'project') return buildProjectHash(route.projectId, route.elementId);
            return `#/${route.id}`;
        }

        function getHistoryState() {
            return window.history.state && typeof window.history.state === 'object'
                ? window.history.state
                : {};
        }

        function saveCurrentEntryScroll() {
            const scrollY = window.scrollY;
            window.history.replaceState(
                { ...getHistoryState(), portfolioRestoreScrollY: scrollY },
                '',
                window.location.href
            );
            return scrollY;
        }

        function resolveScrollIntent(event, requestedIntent) {
            if (requestedIntent) return requestedIntent;
            if (event?.type === 'initial') return { type: 'top', scrollTop: 0 };

            const savedScrollY = Number(getHistoryState().portfolioRestoreScrollY);
            if (Number.isFinite(savedScrollY)) {
                return { type: 'restore', scrollTop: Math.max(0, savedScrollY) };
            }
            if (getHistoryState().portfolioScrollIntent === 'top') {
                return { type: 'top', scrollTop: 0 };
            }
            return { type: 'top', scrollTop: 0 };
        }

        function applyScrollIntent(intent) {
            const scrollTop = intent.type === 'restore' ? intent.scrollTop : 0;
            if (restoreScrollFrame !== null) window.cancelAnimationFrame(restoreScrollFrame);
            restoreScrollFrame = window.requestAnimationFrame(() => {
                restoreScrollFrame = null;
                window.scrollTo({ top: scrollTop, behavior: 'auto' });
            });
        }

        function setProjectBackLabels(label) {
            projectBackButtons.forEach(button => {
                button.setAttribute('aria-label', label);
            });
            const topLabel = projectBackButtons[0]?.querySelector('.project-back-label');
            if (topLabel) topLabel.textContent = label;
            const bottomLabel = document.getElementById('project-detail-bottom-label');
            if (bottomLabel) bottomLabel.textContent = label;
        }

        function renderProjectTags(tagsCsv) {
            const list = document.createElement('ul');
            list.className = 'project-tags';
            tagsCsv.split(',').map(tag => tag.trim()).filter(Boolean).forEach(tag => {
                const item = document.createElement('li');
                item.textContent = tag;
                list.appendChild(item);
            });
            return list;
        }

        function hydrateProjectContent() {
            const contentLinks = [
                ['project-addressables-target', 'addressables-system-extension'],
                ['project-csv-utility-target', 'csv-utility']
            ];
            contentLinks.forEach(([targetId, sourceId]) => {
                const target = projectDetailContent.querySelector(`#${targetId}`);
                const source = document.getElementById(sourceId);
                if (target && source) target.innerHTML = source.innerHTML;
            });

            const troubleshootingLinks = [
                ['project-troubleshoot-target', 'troubleshoot-pz-refactoring'],
                ['project-troubleshoot-target-c', 'troubleshoot-c-navmesh']
            ];
            troubleshootingLinks.forEach(([targetId, sourceId]) => {
                const target = projectDetailContent.querySelector(`#${targetId}`);
                const source = document.getElementById(sourceId);
                if (!target || !source) return;

                target.innerHTML = source.innerHTML;
                target.querySelector('h4')?.remove();
                target.querySelector('p')?.remove();
            });

            buildTroubleTimelines(projectDetailContent);
        }

        function renderProject(projectId) {
            const template = document.getElementById(`temp-${projectId}`);
            if (!template) return false;

            projectDetailTitle.textContent = template.dataset.title;
            projectDetailBodyTitle.textContent = template.dataset.title;
            projectDetailPeriod.textContent = template.dataset.period || '';
            projectDetailPeriod.hidden = !template.dataset.period;
            projectDetailTags.hidden = false;
            projectDetailTags.replaceChildren(renderProjectTags(template.dataset.tags || ''));
            projectDetailContent.innerHTML = '';
            projectDetailContent.appendChild(template.content.cloneNode(true));
            hydrateProjectContent();
            setProjectBackLabels('프로젝트 목록으로 돌아가기');
            return true;
        }

        function renderHighlightDetail(elementId, projectId) {
            const source = document.getElementById(elementId);
            if (!source) return false;

            const title = source.querySelector('h4')?.textContent.trim() || '핵심 경험 상세';
            projectDetailTitle.textContent = title;
            projectDetailBodyTitle.textContent = title;
            projectDetailPeriod.hidden = true;
            projectDetailTags.hidden = true;
            projectDetailContent.innerHTML = '';

            const detail = source.cloneNode(true);
            detail.querySelector('h4')?.remove();
            projectDetailContent.append(...Array.from(detail.childNodes));
            setProjectBackLabels(`${document.getElementById(`temp-${projectId}`)?.dataset.title || '프로젝트'}로 돌아가기`);
            buildTroubleTimelines(projectDetailContent);
            return true;
        }

        function renderTabRoute(route, event, scrollIntent) {
            document.body.classList.remove('project-detail-open');
            projectDetail.hidden = true;
            projectDetail.classList.remove('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.id === route.id);
            });
            document.querySelectorAll('.nav-tabs li button').forEach(button => {
                button.classList.toggle('active', button.dataset.tab === route.id);
            });

            const pageTitle = document.querySelector(`#${route.id} h1`)?.textContent || '소개';
            document.title = `${pageTitle} | Jiwon Han Portfolio`;
            if (event?.type !== 'initial' && typeof gtag === 'function') {
                gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: location.href
                });
            }
            applyScrollIntent(scrollIntent);
        }

        function renderProjectRoute(route, scrollIntent) {
            document.body.classList.add('project-detail-open');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.querySelectorAll('.nav-tabs li button').forEach(button => button.classList.remove('active'));
            projectDetail.hidden = false;
            projectDetail.classList.add('active');

            if (!renderProject(route.projectId)) return;
            if (route.elementId) renderHighlightDetail(route.elementId, route.projectId);
            renderMermaidDiagrams(projectDetailContent);

            document.title = `${projectDetailTitle.textContent} | Jiwon Han Portfolio`;
            applyScrollIntent(scrollIntent);
        }

        function renderRoute(event, requestedIntent = null) {
            const route = parseRoute();
            const scrollIntent = resolveScrollIntent(event, requestedIntent);
            if (route.type === 'project') renderProjectRoute(route, scrollIntent);
            else renderTabRoute(route, event, scrollIntent);
            lastRenderedRoute = route;
        }

        function navigateTo(hash, { replace = false, state = null, scrollIntent = 'top' } = {}) {
            const nextState = {
                ...(state || {}),
                portfolioScrollIntent: scrollIntent
            };
            if (replace) window.history.replaceState(nextState, '', hash);
            else window.history.pushState(nextState, '', hash);
            renderRoute(
                { type: replace ? 'replace' : 'push' },
                { type: scrollIntent, scrollTop: scrollIntent === 'restore' ? Number(nextState.portfolioRestoreScrollY) || 0 : 0 }
            );
        }

        function switchTab(tabId) {
            if (TAB_IDS.includes(tabId)) navigateTo(`#/${tabId}`);
        }

        function openProject(projectId) {
            if (!document.getElementById(`temp-${projectId}`)) return;
            const currentHash = lastRenderedRoute ? routeKey(lastRenderedRoute) : '#/projects';
            const projectHash = buildProjectHash(projectId);
            if (window.location.hash === projectHash && lastRenderedRoute?.type === 'project' && !lastRenderedRoute.elementId) return;
            const returnScrollY = saveCurrentEntryScroll();
            navigateTo(projectHash, {
                state: {
                    portfolioRoute: true,
                    projectReturnHash: currentHash,
                    projectReturnScrollY: returnScrollY
                },
                scrollIntent: 'top'
            });
        }

        function openHighlightDetail(elementId) {
            if (lastRenderedRoute?.type !== 'project' || lastRenderedRoute.elementId) return;
            if (!document.getElementById(elementId)) return;
            const projectHash = buildProjectHash(lastRenderedRoute.projectId);
            const returnScrollY = saveCurrentEntryScroll();
            navigateTo(buildProjectHash(lastRenderedRoute.projectId, elementId), {
                state: {
                    portfolioRoute: true,
                    projectReturnHash: projectHash,
                    projectReturnScrollY: returnScrollY
                },
                scrollIntent: 'top'
            });
        }

        function handleProjectBack() {
            const route = lastRenderedRoute;
            if (route?.type !== 'project') return;

            if (route.elementId) {
                const projectHash = buildProjectHash(route.projectId);
                if (window.history.state?.projectReturnHash === projectHash) history.back();
                else navigateTo(projectHash, { replace: true });
                return;
            }

            if (window.history.state?.projectReturnHash) history.back();
            else navigateTo('#/projects', { replace: true });
        }

        document.addEventListener('click', event => {
            const tabButton = event.target.closest('[data-tab]');
            if (tabButton) {
                switchTab(tabButton.dataset.tab);
                return;
            }

            const projectButton = event.target.closest('[data-project-id]');
            if (projectButton) {
                openProject(projectButton.dataset.projectId);
                return;
            }

            if (event.target.closest('[data-project-back]')) {
                handleProjectBack();
                return;
            }

            const highlightLink = event.target.closest('[data-highlight-id]');
            if (highlightLink) {
                event.preventDefault();
                openHighlightDetail(highlightLink.dataset.highlightId);
            }
        });

        window.addEventListener('hashchange', event => renderRoute(event));
        window.addEventListener('popstate', event => renderRoute(event));
        window.addEventListener('DOMContentLoaded', () => {
            buildTroubleTimelines();
            renderMermaidDiagrams();
            renderRoute({ type: 'initial' });
        });
