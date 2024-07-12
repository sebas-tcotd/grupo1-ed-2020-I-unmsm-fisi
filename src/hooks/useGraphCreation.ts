import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useMemo, useRef } from "react";
import {
  AlgorithmStrategy,
  GraphContext,
  createGraph,
  graphAlgorithms,
} from "../utils";
import { setGraphLayout, setGraphStatus } from "../store/slices/graph";
import { GraphStatus, ThemeOptions } from "../enums";

export const useGraphCreation = () => {
  const dispatch = useDispatch();
  const { numberOfNodes, complexity, status, layout, algorithmUsed } =
    useSelector((state: RootState) => state.graph);
  const graphDivRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const graphContext = useMemo(() => new GraphContext(), []);

  useEffect(() => {
    if (!layout || !(numberOfNodes && complexity) || numberOfNodes <= 0) return;
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    dispatch(setGraphStatus({ status: GraphStatus.CREATING }));

    (async () => {
      const [cytoscapeModule, utilsModule] = await Promise.all([
        import("cytoscape"),
        import("../utils"),
      ]);
      const cytoscape = cytoscapeModule.default;
      const { setGraphStyle } = utilsModule;

      cyRef.current = cytoscape({
        container: graphDivRef.current,
        elements: createGraph(numberOfNodes, complexity),
        style: setGraphStyle(ThemeOptions.DARK),
      });
      cyRef.current.layout({ name: layout }).run();

      dispatch(setGraphLayout({ layout: layout }));
      dispatch(setGraphStatus({ status: GraphStatus.CREATED }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfNodes, complexity, graphDivRef, dispatch]);

  useEffect(() => {
    if (!layout || !cyRef.current) return;

    const cy = cyRef.current;
    cy?.layout({ name: layout }).run();
  }, [layout]);

  useEffect(() => {
    if (!algorithmUsed || !cyRef.current) return;

    const strategy: AlgorithmStrategy = graphAlgorithms[algorithmUsed](
      cyRef.current
    );
    graphContext.setAlgorithmStrategy(strategy);
    graphContext.executeAlgorithm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmUsed]);

  const handleGraphFocus = (): void => {
    const cy = cyRef.current;
    cy?.fit();
  };

  return {
    graphDivRef,
    status,
    handleGraphFocus,
  };
};
