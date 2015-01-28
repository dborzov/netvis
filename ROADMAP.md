##Roadmap for MVP

MVP is specified by [designdoc](https://github.com/dborzov/netvis/blob/master/DESIGNDOC.md) and includes an event parser supporting [netvis format spec](https://github.com/dborzov/netvis/blob/master/netvis.md), the visualization rendering and a pipeline for uploading network logs live.

**Estimated Time of implementation**: 2 weeks

**Estimated hours**: 80 hours

Contents
- [**Week 1**](Week 1): overhauling timeline rendering, adding missing animations, fixing message animations to match timespans

- [**Week 2**](Week 1): finishing events implementation, pipeline demo that loads additional netvis files live, testing

### <a name="Week 1"></a> Week 1: finishing implementation of visualization rendering engine
**Timespan:** Jan 31 - Feb 7th

**Estimated Hours:** 40 hours

- [ ] Timeline overhaul: timeline is to consist of linearly proportional time instances.
- [ ] Event timestamps will be marked on top of the timeline slider in the style described by jbenet in the feedback note
- [ ] Adding animation for node dialing
- [ ] Adding animation for node messages dropped
- [ ] Message delivery animation to match the selected time instance as is described by jbenet's feedback note
- [ ] Fixing properties-panel browsing issues for time instances
- [ ] Detailed documentation for NetVis format events

Event Implementation
- [ ] add event support: messageDropped
- [ ] add event support: nodeDisconnected

### <a name="Week 2"></a> Week 2: finishing event loading implementation, pipeline and demo pages
**Timespan:** Feb 8 - Feb 14th

**Estimated Hours:** 40 hours

Event Implementation
- [ ] add event support: nodeDialed
- [ ] add event support: nodeAccepted
- [ ] add event support: nodeStateChange
- [ ] add event support: annotation

Uploading Pipeline && Demo pages
- [ ] a pipeline demo that loads additional netvis files to the same model live

Testing and debugging
- [ ] Add some test coverage
