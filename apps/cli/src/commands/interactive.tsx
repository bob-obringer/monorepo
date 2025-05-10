import { type ReactNode, useState } from "react";
import { Text } from "ink";
import { AppLayout } from "../app/app-layout.js";
import SelectInput from "ink-select-input";
import { GlobalThermonuclearWar } from "./global-thermo-nuclear-war.js";
import { useCli } from "../app/cli-context.js";
import { SvgConverter } from "./svg-converter.js";
import { DeleteVaults } from "./delete-vaults.js";

type MenuItem<V> = {
  key?: string;
  label: string;
  value: V;
};

const commands = [
  makeCommand("Convert SVG", <SvgConverter />),
  makeCommand("Global Thermonuclear War", <GlobalThermonuclearWar />),
  makeCommand("Delete Vaults", <DeleteVaults />),
];

function makeCommand(label: string, value: ReactNode): MenuItem<ReactNode> {
  return { key: label, label, value };
}

export default function Interactive() {
  const { setCommandName } = useCli();
  const [command, setCommand] = useState<MenuItem<ReactNode> | null>(null);

  function handleSelect(item: MenuItem<ReactNode>) {
    setCommand(item);
    setCommandName(item.label);
  }

  return (
    <AppLayout>
      <Text dimColor={!!command}>Shall we play a game?</Text>
      {!command && <SelectInput items={commands} onSelect={handleSelect} />}
      {command && (
        <Text color="blueBright">
          • {command.label}
          {`\n`}
        </Text>
      )}
      {command && command.value}
    </AppLayout>
  );
}
