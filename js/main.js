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
                    script.src = 'js/lib/mermaid.tiny.js';
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

            const loadingStates = Array.from(diagrams, diagram => {
                const container = document.createElement('div');
                container.className = 'mermaid-rendering';
                diagram.parentNode.insertBefore(container, diagram);
                container.appendChild(diagram);

                const status = document.createElement('div');
                status.className = 'mermaid-loading-status';
                status.setAttribute('role', 'status');
                status.innerHTML = '<span class="mermaid-spinner" aria-hidden="true"></span><span>로딩 중</span>';
                container.appendChild(status);
                return { container, status };
            });

            loadMermaid()
                .then(async mermaid => {
                    await mermaid.run({ nodes: diagrams });
                })
                .catch(error => console.error('Mermaid 다이어그램 렌더링 실패:', error))
                .finally(() => {
                    loadingStates.forEach(({ container, status }) => {
                        container.classList.remove('mermaid-rendering');
                        status.remove();
                    });
                    diagrams.forEach(addMermaidControls);
                });
        }

        function addMermaidControls(diagram) {
            const svg = diagram.querySelector('svg');
            if (!svg || diagram.querySelector('.mermaid-controls')) return;

            const excludedTags = new Set(['defs', 'style', 'title', 'desc', 'metadata']);
            const graphicChildren = Array.from(svg.children)
                .filter(child => !excludedTags.has(child.tagName.toLowerCase()));
            if (graphicChildren.length === 0) return;

            let viewBox = svg.viewBox.baseVal;
            if (!viewBox.width || !viewBox.height) {
                const bounds = svg.getBBox();
                if (!bounds.width || !bounds.height) return;
                svg.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
                viewBox = svg.viewBox.baseVal;
            }

            const viewport = document.createElement('div');
            viewport.className = 'mermaid-viewport';
            diagram.insertBefore(viewport, svg);
            viewport.appendChild(svg);

            const panSurface = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            panSurface.setAttribute('class', 'mermaid-pan-surface');
            panSurface.setAttribute('x', viewBox.x);
            panSurface.setAttribute('y', viewBox.y);
            panSurface.setAttribute('width', viewBox.width);
            panSurface.setAttribute('height', viewBox.height);
            panSurface.setAttribute('fill', 'transparent');
            panSurface.setAttribute('pointer-events', 'all');
            svg.insertBefore(panSurface, graphicChildren[0]);

            const zoomLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            zoomLayer.setAttribute('class', 'mermaid-zoom-layer');
            svg.insertBefore(zoomLayer, graphicChildren[0]);
            graphicChildren.forEach(child => zoomLayer.appendChild(child));

            let scale = 1;
            let translateX = 0;
            let translateY = 0;
            let panEnabled = false;
            let activePointerId = null;
            let lastPointer = null;

            const clampTranslation = () => {
                const minVisibleX = Math.min(viewBox.width * scale, viewBox.width * 0.2);
                const minVisibleY = Math.min(viewBox.height * scale, viewBox.height * 0.2);
                const minX = viewBox.x + minVisibleX - scale * (viewBox.x + viewBox.width);
                const maxX = viewBox.x + viewBox.width - minVisibleX - scale * viewBox.x;
                const minY = viewBox.y + minVisibleY - scale * (viewBox.y + viewBox.height);
                const maxY = viewBox.y + viewBox.height - minVisibleY - scale * viewBox.y;
                translateX = Math.max(minX, Math.min(maxX, translateX));
                translateY = Math.max(minY, Math.min(maxY, translateY));
            };

            const updateTransform = () => {
                clampTranslation();
                zoomLayer.setAttribute('transform', `translate(${translateX} ${translateY}) scale(${scale})`);
            };

            const toSvgPoint = (clientX, clientY) => {
                const point = svg.createSVGPoint();
                point.x = clientX;
                point.y = clientY;
                const matrix = svg.getScreenCTM();
                return matrix ? point.matrixTransform(matrix.inverse()) : point;
            };

            const zoomAt = (nextScale, point) => {
                const clampedScale = Math.min(4, Math.max(0.5, nextScale));
                if (clampedScale === scale) return;

                const anchorX = point?.x ?? viewBox.x + viewBox.width / 2;
                const anchorY = point?.y ?? viewBox.y + viewBox.height / 2;
                const ratio = clampedScale / scale;
                translateX = anchorX - (anchorX - translateX) * ratio;
                translateY = anchorY - (anchorY - translateY) * ratio;
                scale = clampedScale;
                updateTransform();
            };

            const controls = document.createElement('div');
            controls.className = 'mermaid-controls';
            controls.setAttribute('role', 'toolbar');
            controls.setAttribute('aria-label', '다이어그램 조작');

            const panButton = document.createElement('button');
            panButton.type = 'button';
            panButton.className = 'mermaid-pan-toggle';
            panButton.setAttribute('aria-pressed', 'false');
            panButton.setAttribute('aria-label', '드래그 이동');
            const panIcon = document.createElement('span');
            panIcon.className = 'material-symbols-outlined';
            panIcon.setAttribute('aria-hidden', 'true');
            panIcon.textContent = 'pan_tool';
            const panLabel = document.createElement('span');
            panLabel.textContent = '드래그';
            panButton.append(panIcon, panLabel);
            panButton.addEventListener('click', () => {
                panEnabled = !panEnabled;
                panButton.setAttribute('aria-pressed', String(panEnabled));
                diagram.classList.toggle('mermaid-pan-enabled', panEnabled);
            });

            const zoomOutButton = document.createElement('button');
            zoomOutButton.type = 'button';
            zoomOutButton.setAttribute('aria-label', '다이어그램 축소');
            const zoomOutIcon = document.createElement('span');
            zoomOutIcon.className = 'material-symbols-outlined';
            zoomOutIcon.setAttribute('aria-hidden', 'true');
            zoomOutIcon.textContent = 'zoom_out';
            zoomOutButton.appendChild(zoomOutIcon);
            zoomOutButton.addEventListener('click', () => zoomAt(scale / 1.2));

            const zoomInButton = document.createElement('button');
            zoomInButton.type = 'button';
            zoomInButton.setAttribute('aria-label', '다이어그램 확대');
            const zoomInIcon = document.createElement('span');
            zoomInIcon.className = 'material-symbols-outlined';
            zoomInIcon.setAttribute('aria-hidden', 'true');
            zoomInIcon.textContent = 'zoom_in';
            zoomInButton.appendChild(zoomInIcon);
            zoomInButton.addEventListener('click', () => zoomAt(scale * 1.2));

            const resetButton = document.createElement('button');
            resetButton.type = 'button';
            resetButton.setAttribute('aria-label', '다이어그램 보기 초기화');
            const resetIcon = document.createElement('span');
            resetIcon.className = 'material-symbols-outlined';
            resetIcon.setAttribute('aria-hidden', 'true');
            resetIcon.textContent = 'zoom_in_map';
            resetButton.appendChild(resetIcon);
            resetButton.addEventListener('click', () => {
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateTransform();
            });

            controls.append(panButton, zoomOutButton, zoomInButton, resetButton);
            diagram.appendChild(controls);
            diagram.setAttribute('role', 'group');
            diagram.setAttribute('aria-label', '이동 및 확대·축소할 수 있는 다이어그램');

            svg.addEventListener('pointerdown', event => {
                if (!panEnabled || (event.pointerType === 'mouse' && event.button !== 0)) return;

                activePointerId = event.pointerId;
                lastPointer = toSvgPoint(event.clientX, event.clientY);
                svg.setPointerCapture(event.pointerId);
                event.preventDefault();
            });

            svg.addEventListener('pointermove', event => {
                if (event.pointerId !== activePointerId || !lastPointer) return;

                const currentPointer = toSvgPoint(event.clientX, event.clientY);
                translateX += currentPointer.x - lastPointer.x;
                translateY += currentPointer.y - lastPointer.y;
                lastPointer = currentPointer;
                updateTransform();
            });

            const stopPanning = event => {
                if (event.pointerId !== activePointerId) return;
                activePointerId = null;
                lastPointer = null;
            };
            svg.addEventListener('pointerup', stopPanning);
            svg.addEventListener('pointercancel', stopPanning);
            svg.addEventListener('lostpointercapture', stopPanning);
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
                target.querySelector('.panel-title')?.remove();
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
            setProjectBackLabels('돌아가기');
            return true;
        }

        function renderHighlightDetail(elementId, projectId) {
            const source = document.getElementById(elementId);
            if (!source) return false;

            const title = source.querySelector('.panel-title')?.textContent.trim() || '핵심 경험 상세';
            projectDetailTitle.textContent = title;
            projectDetailBodyTitle.textContent = title;
            projectDetailPeriod.hidden = true;
            projectDetailTags.hidden = true;
            projectDetailContent.innerHTML = '';

            const detail = source.cloneNode(true);
            detail.querySelector('.panel-title')?.remove();
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
        function buildHighlightsToc() {
            const highlights = document.getElementById('highlights');
            const toc = highlights.querySelector('.highlights-toc');
            const list = toc.querySelector('ul');
            let scrollFrame = null;
            list.replaceChildren();

            highlights.querySelectorAll('h2').forEach(heading => {
                const item = document.createElement('li');
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = heading.textContent.trim();
                button.addEventListener('click', () => {
                    window.cancelAnimationFrame(scrollFrame);
                    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    // 제목의 실제 위치에서 보이는 화면 상단과 이동 여유를 뺀다.
                    const getTargetTop = () => {
                        const viewportTop = window.visualViewport?.offsetTop || 0;
                        return Math.max(0, heading.getBoundingClientRect().top + window.scrollY - viewportTop - 32);
                    };
                    const arrive = () => {
                        window.scrollTo({ top: getTargetTop(), behavior: 'instant' });
                        heading.setAttribute('tabindex', '-1');
                        heading.focus({ preventScroll: true });
                        scrollFrame = null;
                    };
                    if (reducedMotion) {
                        arrive();
                        return;
                    }

                    const startTop = window.scrollY;
                    const distance = getTargetTop() - startTop;
                    const previewDistance = Math.sign(distance) * Math.min(120, Math.abs(distance) * 0.15);
                    let startTime = null;
                    // 자동 스크롤 대신 짧은 이동을 직접 그린 뒤 목적지로 이동한다.
                    const animate = timestamp => {
                        if (!highlights.classList.contains('active')) {
                            scrollFrame = null;
                            return;
                        }
                        if (startTime === null) startTime = timestamp;
                        const progress = Math.min(1, (timestamp - startTime) / 140);
                        if (progress === 1) {
                            arrive();
                            return;
                        }
                        window.scrollTo({
                            top: startTop + previewDistance * (1 - (1 - progress) ** 2),
                            behavior: 'instant'
                        });
                        scrollFrame = window.requestAnimationFrame(animate);
                    };
                    scrollFrame = window.requestAnimationFrame(animate);
                });
                item.appendChild(button);
                list.appendChild(item);
            });
            toc.hidden = list.children.length === 0;
        }

        window.addEventListener('DOMContentLoaded', () => {
            buildHighlightsToc();
            buildTroubleTimelines();
            renderMermaidDiagrams();
            renderRoute({ type: 'initial' });
        });
