import '@react-three/fiber';
import { times } from 'lodash';
import { FC, memo } from 'react';
import * as Root from './Root';

// export const data = merge(Root.data, {
//   '.stellar': {
//     label: 'Fuel Tank',
//   },
//   n: 'Fuel Tank',
//   N: {
//     width_original: 2,
//     width_a: 2,
//     width_b: 2,
//     height: 2,
//     fuel_percent: 1,
//   },
//   T: {
//     color_tex: '_',
//     shape_tex: '_',
//   },
// });

export const data = {
  n: 'Fuel Tank',
  p: {
    x: 0,
    y: 0,
  },
  o: {
    x: 1,
    y: 1,
    z: 0,
  },
  t: '-Infinity',
  '.stellar': {
    label: 'Fuel Tank',
    visible: true,
    locked: false,
  },
  N: {
    width_original: 2,
    width_a: 2,
    width_b: 2,
    height: 2,
    fuel_percent: 1,
  },
  T: {
    color_tex: '_',
    shape_tex: '_',
  },
};

export type type = Root.type & typeof data;

// ONLY FOR DEBUGGING PURPOSES
// const randomColor = () => {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return new THREE.Color(color);
// };

const lerp = (x: number, y: number, lerp: number) => x * (1 - lerp) + y * lerp;

type partComponentProps = Root.partComponentProps & {
  data: type;
};

export const Component: FC<partComponentProps> = memo(({ data, offset }) => {
  if (!data['.stellar'].visible) return <mesh />;

  const position = {
    x: data.p.x + offset.x,
    y: data.p.y + offset.y,
  };

  const faceCount = 24;

  const bevelMargin = 0.1;

  const rivetMargin = 0.04;
  const rivetCount = Math.floor(faceCount / 4);

  const rotation = data.o.z * (Math.PI / 180);

  const rimHeight = 0.1;
  const rimSlopeHeight = 0.1;

  const nozzlesPerMeter = 3;
  const nozzleHeight = 0.1;
  const nozzleOffset = 1 / 6;

  const color = 'white';

  const materials = {
    flat: <meshBasicMaterial />,
    faces: (
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.8}
        flatShading={true}
      />
    ),
    smooth: (
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.8}
        flatShading={false}
      />
    ),
  };

  switch (data.T.shape_tex) {
    case 'Rivets': {
      const rivets = times(rivetCount, (index) => (
        <mesh rotation={[0, (index / rivetCount) * 90 * (Math.PI / 180), 0]}>
          <cylinderGeometry
            args={[
              data.N.width_b / 2,
              data.N.width_a / 2,
              data.N.height,
              4,
              undefined,
              true,
            ]}
          />
          {materials.faces}
        </mesh>
      ));

      return (
        <group
          scale={[data.o.x, data.o.y, 1]}
          rotation={[0, 0, rotation]}
          position={[position.x, position.y + data.N.height / 2, 0]}
        >
          <mesh>
            <cylinderGeometry
              args={[
                Math.max(0, data.N.width_b / 2 - rivetMargin),
                Math.max(0, data.N.width_a / 2 - rivetMargin),
                data.N.height,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          {rivets}
        </group>
      );
    }

    case 'Half Rivets': {
      const rivets = times(rivetCount, (index) => (
        <mesh
          rotation={[0, (index / rivetCount) * 90 * (Math.PI / 180), 0]}
          position={[0, data.N.height / -4, 0]}
        >
          <cylinderGeometry
            args={[
              (data.N.width_b + data.N.width_a) / 4,
              data.N.width_a / 2,
              data.N.height / 2,
              4,
              undefined,
              true,
            ]}
          />
          {materials.faces}
        </mesh>
      ));

      return (
        <group
          scale={[data.o.x, data.o.y, 1]}
          rotation={[0, 0, rotation]}
          position={[position.x, position.y + data.N.height / 2, 0]}
        >
          <mesh position={[0, data.N.height / -4, 0]}>
            <cylinderGeometry
              args={[
                Math.max(
                  0,
                  (data.N.width_b + data.N.width_a) / 4 - rivetMargin,
                ),
                Math.max(0, data.N.width_a / 2 - rivetMargin),
                data.N.height / 2,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh position={[0, data.N.height / 4, 0]}>
            <cylinderGeometry
              args={[
                data.N.width_b / 2,
                (data.N.width_b + data.N.width_a) / 4,
                data.N.height / 2,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          {rivets}
        </group>
      );
    }

    case 'Flat': {
      return (
        <mesh
          scale={[data.o.x, data.o.y, 1]}
          rotation={[0, 0, rotation]}
          position={[position.x, position.y + data.N.height / 2, 0]}
        >
          <cylinderGeometry
            args={[
              data.N.width_b / 2,
              data.N.width_a / 2,
              data.N.height,
              4,
              undefined,
              true,
            ]}
          />
          {materials.flat}
        </mesh>
      );
    }

    case 'Interstage': {
      const rivets = times(rivetCount, (index) => (
        <mesh rotation={[0, (index / rivetCount) * 90 * (Math.PI / 180), 0]}>
          <cylinderGeometry
            args={[
              data.N.width_b / 2,
              data.N.width_a / 2,
              data.N.height,
              4,
              undefined,
              true,
            ]}
          />
          {materials.faces}
        </mesh>
      ));

      return (
        <group
          scale={[data.o.x, data.o.y, 1]}
          rotation={[0, 0, rotation]}
          position={[position.x, position.y + data.N.height / 2, 0]}
        >
          <mesh>
            <cylinderGeometry
              args={[
                Math.max(0, data.N.width_b / 2 - rivetMargin),
                Math.max(0, data.N.width_a / 2 - rivetMargin),
                data.N.height,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height, data.N.height - rimHeight) / 2,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                data.N.width_b / 2,
                lerp(
                  data.N.width_b,
                  data.N.width_a,
                  rimHeight / data.N.height / 1,
                ) / 2,
                Math.min(data.N.height, rimHeight),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height, data.N.height - rimSlopeHeight) / 2 -
                rimHeight,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                lerp(
                  data.N.width_b,
                  data.N.width_a,
                  rimHeight / data.N.height / 1,
                ) / 2,
                Math.max(
                  0,
                  lerp(
                    data.N.width_b,
                    data.N.width_a,
                    (rimHeight + rimSlopeHeight) / data.N.height / 1,
                  ) /
                    2 -
                    rivetMargin,
                ),
                Math.min(data.N.height, rimSlopeHeight),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          {rivets}
        </group>
      );
    }

    case 'Interstage Full': {
      const rivets = times(rivetCount, (index) => (
        <mesh rotation={[0, (index / rivetCount) * 90 * (Math.PI / 180), 0]}>
          <cylinderGeometry
            args={[
              data.N.width_b / 2,
              data.N.width_a / 2,
              data.N.height,
              4,
              undefined,
              true,
            ]}
          />
          {materials.faces}
        </mesh>
      ));

      return (
        <group
          scale={[data.o.x, data.o.y, 1]}
          rotation={[0, 0, rotation]}
          position={[position.x, position.y + data.N.height / 2, 0]}
        >
          <mesh>
            <cylinderGeometry
              args={[
                Math.max(0, data.N.width_b / 2 - rivetMargin),
                Math.max(0, data.N.width_a / 2 - rivetMargin),
                data.N.height,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height, data.N.height - rimHeight) / 2,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                data.N.width_b / 2,
                lerp(
                  data.N.width_b,
                  data.N.width_a,
                  rimHeight / data.N.height / 1,
                ) / 2,
                Math.min(data.N.height, rimHeight),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height, data.N.height - rimSlopeHeight) / 2 -
                rimHeight,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                lerp(
                  data.N.width_b,
                  data.N.width_a,
                  rimHeight / data.N.height / 1,
                ) / 2,
                Math.max(
                  0,
                  lerp(
                    data.N.width_b,
                    data.N.width_a,
                    (rimHeight + rimSlopeHeight) / data.N.height / 1,
                  ) /
                    2 -
                    rivetMargin,
                ),
                Math.min(data.N.height, rimSlopeHeight),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height, data.N.height - rimHeight) / -2,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                lerp(
                  data.N.width_a,
                  data.N.width_b,
                  rimHeight / data.N.height / 1,
                ) / 2,
                data.N.width_a / 2,
                Math.min(data.N.height, rimHeight),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height, data.N.height - rimSlopeHeight) / -2 +
                rimHeight,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                Math.max(
                  0,
                  lerp(
                    data.N.width_a,
                    data.N.width_b,
                    (rimHeight + rimSlopeHeight) / data.N.height / 1,
                  ) /
                    2 -
                    rivetMargin,
                ),
                lerp(
                  data.N.width_a,
                  data.N.width_b,
                  rimHeight / data.N.height / 1,
                ) / 2,
                Math.min(data.N.height, rimSlopeHeight),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          {rivets}
        </group>
      );
    }

    case 'Nozzle_4': {
      const nozzleCount = Math.floor(data.N.height * nozzlesPerMeter);
      const nozzles = times(nozzleCount, (index) => (
        <group
          position={[
            0,
            (index / nozzleCount) * data.N.height -
              data.N.height / 2 +
              nozzleOffset,
            0,
          ]}
        >
          <mesh position={[0, nozzleHeight / 2, 0]}>
            <cylinderGeometry
              args={[
                Math.max(
                  0,
                  lerp(
                    data.N.width_a,
                    data.N.width_b,
                    index / nozzleCount +
                      (nozzleHeight / 2 + nozzleOffset) / data.N.height,
                  ) /
                    2 -
                    rivetMargin,
                ),
                lerp(
                  data.N.width_a,
                  data.N.width_b,
                  index / nozzleCount + nozzleOffset / data.N.height,
                ) / 2,
                nozzleHeight / 2,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh>
            <cylinderGeometry
              args={[
                lerp(
                  data.N.width_a,
                  data.N.width_b,
                  index / nozzleCount + nozzleOffset / data.N.height,
                ) / 2,
                Math.max(
                  0,
                  lerp(
                    data.N.width_a,
                    data.N.width_b,
                    index / nozzleCount -
                      (nozzleHeight / 2 - nozzleOffset) / data.N.height,
                  ) /
                    2 -
                    rivetMargin,
                ),
                nozzleHeight / 2,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
        </group>
      ));

      return (
        <group
          scale={[data.o.x, data.o.y, 1]}
          rotation={[0, 0, rotation]}
          position={[position.x, position.y + data.N.height / 2, 0]}
        >
          <mesh>
            <cylinderGeometry
              args={[
                Math.max(0, data.N.width_b / 2 - rivetMargin),
                Math.max(0, data.N.width_a / 2 - rivetMargin),
                data.N.height,
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          {nozzles}
        </group>
      );
    }

    /**
     * Strut fuel tanks are not supported yet, I'm going to add them when I
     * implement low poly parts (which are going to be closer to what's
     * in-game) and it's going to replace this hi-poly crap
     */
    default:
    case '_':
    case 'Strut':
    case 'Edges Faces': {
      return (
        <group
          scale={[data.o.x, data.o.y, 1]}
          position={[position.x, position.y + data.N.height / 2, 0]}
          rotation={[0, 0, rotation]}
        >
          <mesh>
            <cylinderGeometry
              args={[
                data.N.width_b / 2,
                data.N.width_a / 2,
                Math.max(0, data.N.height - bevelMargin * 2),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.max(data.N.height / 4, (data.N.height - bevelMargin) / 2),
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                Math.max(0, data.N.width_b / 2 - bevelMargin),
                data.N.width_b / 2,
                Math.min(bevelMargin, data.N.height / 2),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height / -4, (data.N.height - bevelMargin) / -2),
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                data.N.width_a / 2,
                Math.max(0, data.N.width_a / 2 - bevelMargin),
                Math.min(bevelMargin, data.N.height / 2),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.faces}
          </mesh>
        </group>
      );
    }

    case 'Edges Smooth': {
      return (
        <group
          scale={[data.o.x, data.o.y, 1]}
          position={[position.x, position.y + data.N.height / 2, 0]}
          rotation={[0, 0, rotation]}
        >
          <mesh>
            <cylinderGeometry
              args={[
                data.N.width_b / 2,
                data.N.width_a / 2,
                Math.max(0, data.N.height - bevelMargin * 2),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.smooth}
          </mesh>
          <mesh
            position={[
              0,
              Math.max(data.N.height / 4, (data.N.height - bevelMargin) / 2),
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                Math.max(0, data.N.width_b / 2 - bevelMargin),
                data.N.width_b / 2,
                Math.min(bevelMargin, data.N.height / 2),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.smooth}
          </mesh>
          <mesh
            position={[
              0,
              Math.min(data.N.height / -4, (data.N.height - bevelMargin) / -2),
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                data.N.width_a / 2,
                Math.max(0, data.N.width_a / 2 - bevelMargin),
                Math.min(bevelMargin, data.N.height / 2),
                faceCount,
                undefined,
                true,
              ]}
            />
            {materials.smooth}
          </mesh>
        </group>
      );
    }

    case 'Flat Smooth': {
      return (
        <mesh
          scale={[data.o.x, data.o.y, 1]}
          rotation={[0, 0, rotation]}
          position={[position.x, position.y + data.N.height / 2, 0]}
        >
          <cylinderGeometry
            args={[
              data.N.width_b / 2,
              data.N.width_a / 2,
              data.N.height,
              faceCount,
              undefined,
              true,
            ]}
          />
          {materials.smooth}
        </mesh>
      );
    }
  }
});
